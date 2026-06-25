namespace ExpenseFlow.Application.DTOs;

public record AppUserDto(
    Guid Id,
    string ClerkUserId,
    string Email,
    string? DisplayName,
    DateTime CreatedAt
);

public record SyncUserRequest(
    string ClerkUserId,
    string Email,
    string? DisplayName
);
