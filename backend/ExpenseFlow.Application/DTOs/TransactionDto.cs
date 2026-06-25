namespace ExpenseFlow.Application.DTOs;

public record TransactionDto(
    Guid Id,
    string TransactionType,
    decimal Amount,
    string? Description,
    DateOnly TransactionDate,
    string EntrySource,
    string TransactionStatus,
    Guid? CategoryId,
    string? CategoryName,
    Guid TransactionSourceId,
    string TransactionSourceName,
    string TransactionSourceType,
    DateTime CreatedAt
);

public record CreateTransactionRequest(
    string TransactionType,
    decimal Amount,
    string? Description,
    DateOnly? TransactionDate,
    string TransactionStatus,
    Guid? CategoryId,
    Guid TransactionSourceId
);

public record UpdateTransactionRequest(
    string? TransactionType,
    decimal? Amount,
    string? Description,
    DateOnly? TransactionDate,
    string? TransactionStatus,
    Guid? CategoryId,
    Guid? TransactionSourceId
);
