using ExpenseFlow.Application.DTOs;

namespace ExpenseFlow.Application.Services;

public interface IUserService
{
    Task<AppUserDto> SyncUserAsync(SyncUserRequest request);
    Task<AppUserDto?> GetByClerkIdAsync(string clerkUserId);
}
