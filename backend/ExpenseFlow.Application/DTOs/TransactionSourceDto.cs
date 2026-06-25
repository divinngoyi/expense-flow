namespace ExpenseFlow.Application.DTOs;

public record TransactionSourceDto(
    Guid Id,
    string SourceType,
    string Name,
    bool IsDefault,
    bool IsArchived
);

public record CreateTransactionSourceRequest(
    string SourceType,
    string Name,
    bool IsDefault = false
);

public record UpdateTransactionSourceRequest(
    string? Name,
    bool? IsDefault,
    bool? IsArchived
);
