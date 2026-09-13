using ExpenseFlow.Application.DTOs;
using ExpenseFlow.Application.Services;
using ExpenseFlow.Domain.Entities;
using ExpenseFlow.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Npgsql;

namespace ExpenseFlow.Database.Services;

public class UserService(ExpenseFlowDbContext db, ILogger<UserService> logger) : IUserService
{
    private const string ExternalAuthUserIdIndex = "IX_AppUsers_ExternalAuthUserId";

    public async Task<AppUserDto> SyncUserAsync(SyncUserRequest request)
    {
        var user = await db.AppUsers
            .FirstOrDefaultAsync(u => u.ExternalAuthUserId == request.ExternalAuthUserId && !u.IsDeleted);

        if (user is null)
        {
            logger.LogInformation("New user synced: {ExternalAuthUserId} ({Email})", request.ExternalAuthUserId, request.Email);

            user = new AppUser
            {
                Id = Guid.NewGuid(),
                ExternalAuthUserId = request.ExternalAuthUserId,
                Email = request.Email,
                DisplayName = request.DisplayName,
                CreatedAt = DateTime.UtcNow,
                LastLoginAt = DateTime.UtcNow,
            };
            db.AppUsers.Add(user);

            // Seed default transaction sources for every new user
            var now = DateTime.UtcNow;
            db.TransactionSources.AddRange(
                new TransactionSource { Id = Guid.NewGuid(), UserId = user.Id, SourceType = SourceType.Cash, Name = "Cash", IsDefault = true, CreatedAt = now },
                new TransactionSource { Id = Guid.NewGuid(), UserId = user.Id, SourceType = SourceType.Bank, Name = "Bank", IsDefault = false, CreatedAt = now },
                new TransactionSource { Id = Guid.NewGuid(), UserId = user.Id, SourceType = SourceType.DigitalWallet, Name = "Digital Wallet", IsDefault = false, CreatedAt = now }
            );
        }
        else
        {
            logger.LogInformation("Returning user synced: {ExternalAuthUserId}", request.ExternalAuthUserId);
            user.Email = request.Email;
            if (request.DisplayName is not null) user.DisplayName = request.DisplayName;
            user.LastLoginAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
        }

        try
        {
            await db.SaveChangesAsync();
        }
        catch (DbUpdateException exception) when (IsConcurrentUserInsert(exception))
        {
            logger.LogInformation(
                "User {ExternalAuthUserId} was synced by a concurrent request",
                request.ExternalAuthUserId);

            db.ChangeTracker.Clear();
            user = await db.AppUsers.SingleAsync(
                u => u.ExternalAuthUserId == request.ExternalAuthUserId && !u.IsDeleted);
        }

        return ToDto(user);
    }

    public async Task<AppUserDto?> GetByExternalAuthIdAsync(string externalAuthUserId)
    {
        var user = await db.AppUsers
            .FirstOrDefaultAsync(u => u.ExternalAuthUserId == externalAuthUserId && !u.IsDeleted);
        return user is null ? null : ToDto(user);
    }

    private static AppUserDto ToDto(AppUser u) =>
        new(u.Id, u.ExternalAuthUserId, u.Email, u.DisplayName, u.CreatedAt);

    private static bool IsConcurrentUserInsert(DbUpdateException exception) =>
        exception.InnerException is PostgresException
        {
            SqlState: PostgresErrorCodes.UniqueViolation,
            ConstraintName: ExternalAuthUserIdIndex,
        };
}
