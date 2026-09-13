using System.Threading.RateLimiting;
using ExpenseFlow.Api.Extensions;
using ExpenseFlow.Database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

// Load .env from any ancestor directory — works for dotnet run locally,
// no-op in Docker (file is never copied into the image).
static void LoadDotEnv()
{
    var dir = new DirectoryInfo(AppContext.BaseDirectory);
    while (dir is not null)
    {
        var candidate = Path.Combine(dir.FullName, ".env");
        if (File.Exists(candidate))
        {
            foreach (var line in File.ReadAllLines(candidate))
            {
                if (string.IsNullOrWhiteSpace(line) || line.TrimStart().StartsWith('#')) continue;
                var idx = line.IndexOf('=');
                if (idx < 0) continue;
                var key = line[..idx].Trim();
                var value = line[(idx + 1)..].Trim();
                // Never overwrite vars that were already set in the process environment
                if (!string.IsNullOrEmpty(key) && Environment.GetEnvironmentVariable(key) is null)
                    Environment.SetEnvironmentVariable(key, value);
            }
            break;
        }
        dir = dir.Parent;
    }
}

LoadDotEnv();

var builder = WebApplication.CreateBuilder(args);

// ── Database ─────────────────────────────────────────────────────────────────
builder.Services.AddDbContext<ExpenseFlowDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── Authentication (Supabase JWT) ─────────────────────────────────────────────
var supabaseUrl = builder.Configuration["Supabase:Url"]
    ?? builder.Configuration["NEXT_PUBLIC_SUPABASE_URL"];
if (string.IsNullOrWhiteSpace(supabaseUrl))
    throw new InvalidOperationException("Supabase:Url is required.");

var supabaseIssuer = $"{supabaseUrl.TrimEnd('/')}/auth/v1";
var supabaseAudience = builder.Configuration["Supabase:Audience"] ?? "authenticated";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = supabaseIssuer;
        options.Audience = supabaseAudience;
        options.RequireHttpsMetadata = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = supabaseIssuer,
            ValidateAudience = true,
            ValidAudience = supabaseAudience,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            NameClaimType = "sub",
            RoleClaimType = "role",
            ClockSkew = TimeSpan.FromMinutes(1),
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddMemoryCache();

// ── CORS ──────────────────────────────────────────────────────────────────────
var allowedOrigins = builder.Configuration["CORS:AllowedOrigins"]
    ?.Split(',', StringSplitOptions.RemoveEmptyEntries) ?? [];

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()));

// ── Application services ──────────────────────────────────────────────────────
builder.Services.AddApplicationServices();

// ── Rate limiting ─────────────────────────────────────────────────────────────
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // Per-IP sliding window: 60 requests per minute
    options.AddPolicy("api", context =>
        RateLimitPartition.GetSlidingWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new SlidingWindowRateLimiterOptions
            {
                PermitLimit = 60,
                Window = TimeSpan.FromMinutes(1),
                SegmentsPerWindow = 6,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0,
            }));

    options.OnRejected = async (ctx, ct) =>
    {
        ctx.HttpContext.Response.StatusCode = 429;
        await ctx.HttpContext.Response.WriteAsJsonAsync(
            new { error = "Too many requests. Please wait a moment and try again." }, ct);
    };
});

// ── Controllers + Swagger ─────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("ExpenseFlow API starting — Environment: {Env}", app.Environment.EnvironmentName);

// Pay the hosted Postgres connection and EF model warm-up cost during API startup
// instead of making the first signed-in user wait for it on the dashboard.
try
{
    var stopwatch = System.Diagnostics.Stopwatch.StartNew();
    await using var scope = app.Services.CreateAsyncScope();
    var db = scope.ServiceProvider.GetRequiredService<ExpenseFlowDbContext>();
    await db.Database.OpenConnectionAsync();
    _ = await db.AppUsers.AsNoTracking().AnyAsync();
    await db.Database.CloseConnectionAsync();
    logger.LogInformation("Database connection warmed in {ElapsedMs:F1} ms", stopwatch.Elapsed.TotalMilliseconds);
}
catch (Exception exception)
{
    logger.LogWarning(exception, "Database warm-up failed; the first request will retry normally");
}

// ── Global exception handler ──────────────────────────────────────────────────
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (UnauthorizedAccessException ex)
    {
        var log = context.RequestServices.GetRequiredService<ILogger<Program>>();
        log.LogWarning("401 Unauthorized — {Path} — {Message}", context.Request.Path, ex.Message);
        context.Response.StatusCode = 401;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { error = ex.Message });
    }
    catch (KeyNotFoundException ex)
    {
        var log = context.RequestServices.GetRequiredService<ILogger<Program>>();
        log.LogWarning("404 Not Found — {Path} — {Message}", context.Request.Path, ex.Message);
        context.Response.StatusCode = 404;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { error = ex.Message });
    }
    catch (ArgumentException ex)
    {
        var log = context.RequestServices.GetRequiredService<ILogger<Program>>();
        log.LogWarning("400 Bad Request — {Path} — {Message}", context.Request.Path, ex.Message);
        context.Response.StatusCode = 400;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { error = ex.Message });
    }
    catch (Exception ex)
    {
        var log = context.RequestServices.GetRequiredService<ILogger<Program>>();
        log.LogError(ex, "500 Unhandled Exception — {Path}", context.Request.Path);
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { error = "An unexpected error occurred" });
    }
});

// ── Request logging ───────────────────────────────────────────────────────────
app.Use(async (context, next) =>
{
    var log = context.RequestServices.GetRequiredService<ILogger<Program>>();
    var stopwatch = System.Diagnostics.Stopwatch.StartNew();
    log.LogInformation("→ {Method} {Path}", context.Request.Method, context.Request.Path);
    await next();
    stopwatch.Stop();
    log.LogInformation(
        "← {Method} {Path} {Status} in {ElapsedMs:F1} ms",
        context.Request.Method,
        context.Request.Path,
        context.Response.StatusCode,
        stopwatch.Elapsed.TotalMilliseconds);
});

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers().RequireRateLimiting("api");

app.Run();
