using ExpenseFlow.Application.DTOs;

namespace ExpenseFlow.Application.Services;

public interface ITransactionSourceService
{
    Task<List<TransactionSourceDto>> GetSourcesAsync(Guid userId);
    Task<TransactionSourceDto> CreateSourceAsync(Guid userId, CreateTransactionSourceRequest request);
    Task<TransactionSourceDto> UpdateSourceAsync(Guid userId, Guid sourceId, UpdateTransactionSourceRequest request);
    Task<TransactionSourceDto> GetOrCreateCashSourceAsync(Guid userId);
}
