using ExpenseFlow.Application.DTOs;
using ExpenseFlow.Application.Services;
using ExpenseFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExpenseFlow.Database.Services;

public class UserService(ExpenseFlowDbContext db) : IUserService
{
    public async Task<AppUserDto> SyncUserAsync(SyncUserRequest request)
    {
        var user = await db.AppUsers
            .FirstOrDefaultAsync(u => u.ClerkUserId == request.ClerkUserId && !u.IsDeleted);

        if (user is null)
        {
            user = new AppUser
            {
                Id = Guid.NewGuid(),
                ClerkUserId = request.ClerkUserId,
                Email = request.Email,
                DisplayName = request.DisplayName,
                CreatedAt = DateTime.UtcNow,
                LastLoginAt = DateTime.UtcNow,
            };
            db.AppUsers.Add(user);
        }
        else
        {
            user.Email = request.Email;
            if (request.DisplayName is not null) user.DisplayName = request.DisplayName;
            user.LastLoginAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync();
        return ToDto(user);
    }

    public async Task<AppUserDto?> GetByClerkIdAsync(string clerkUserId)
    {
        var user = await db.AppUsers
            .FirstOrDefaultAsync(u => u.ClerkUserId == clerkUserId && !u.IsDeleted);
        return user is null ? null : ToDto(user);
    }

    private static AppUserDto ToDto(AppUser u) =>
        new(u.Id, u.ClerkUserId, u.Email, u.DisplayName, u.CreatedAt);
}
