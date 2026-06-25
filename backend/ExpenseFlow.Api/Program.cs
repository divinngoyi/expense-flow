using ExpenseFlow.Api.Extensions;
using ExpenseFlow.Database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
