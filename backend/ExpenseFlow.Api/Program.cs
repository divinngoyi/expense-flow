using ExpenseFlow.Api.Extensions;
using ExpenseFlow.Database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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

// ── Authentication (Clerk JWT) ────────────────────────────────────────────────
var clerkIssuer = builder.Configuration["Clerk:Issuer"];
var clerkJwksUrl = builder.Configuration["Clerk:JwksUrl"];
var clerkAudience = builder.Configuration["Clerk:Audience"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = !string.IsNullOrEmpty(clerkIssuer),
            ValidIssuer = clerkIssuer,
            ValidateAudience = !string.IsNullOrEmpty(clerkAudience),
            ValidAudience = clerkAudience,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = !string.IsNullOrEmpty(clerkJwksUrl),
        };

        if (!string.IsNullOrEmpty(clerkJwksUrl))
        {
            options.TokenValidationParameters.IssuerSigningKeyResolver = (_, _, _, _) =>
            {
                using var client = new HttpClient();
                var json = client.GetStringAsync(clerkJwksUrl).GetAwaiter().GetResult();
                var keys = new JsonWebKeySet(json);
                return keys.GetSigningKeys();
            };
        }
    });

builder.Services.AddAuthorization();

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

// ── Controllers + Swagger ─────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("ExpenseFlow API starting — Environment: {Env}", app.Environment.EnvironmentName);

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
    log.LogInformation("→ {Method} {Path}", context.Request.Method, context.Request.Path);
    await next();
    log.LogInformation("← {Method} {Path} {Status}", context.Request.Method, context.Request.Path, context.Response.StatusCode);
});

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
