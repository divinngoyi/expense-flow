using ExpenseFlow.Application.DTOs;

namespace ExpenseFlow.Application.Services;

public interface ITransactionService
{
    Task<List<TransactionDto>> GetTransactionsAsync(Guid userId, int year, int month);
    Task<TransactionDto> GetByIdAsync(Guid userId, Guid transactionId);
    Task<TransactionDto> CreateAsync(Guid userId, CreateTransactionRequest request);
    Task<TransactionDto> UpdateAsync(Guid userId, Guid transactionId, UpdateTransactionRequest request);
    Task DeleteAsync(Guid userId, Guid transactionId);
    Task<TransactionDto> ConfirmAsync(Guid userId, Guid transactionId);
    Task<TransactionDto> SkipAsync(Guid userId, Guid transactionId);
}
