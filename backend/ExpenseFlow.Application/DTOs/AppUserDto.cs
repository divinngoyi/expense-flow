namespace ExpenseFlow.Application.DTOs;

public record AppUserDto(
    Guid Id,
    string ExternalAuthUserId,
    string Email,
    string? DisplayName,
    DateTime CreatedAt
);

public record SyncUserRequest(
    string ExternalAuthUserId,
    string Email,
    string? DisplayName
);
