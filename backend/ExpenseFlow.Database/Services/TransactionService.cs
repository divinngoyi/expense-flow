using ExpenseFlow.Application.DTOs;
using ExpenseFlow.Application.Services;
using ExpenseFlow.Domain.Entities;
using ExpenseFlow.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ExpenseFlow.Database.Services;

public class TransactionService(ExpenseFlowDbContext db) : ITransactionService
{
    public async Task<List<TransactionDto>> GetTransactionsAsync(Guid userId, int year, int month)
    {
        var from = new DateOnly(year, month, 1);
        var to = from.AddMonths(1).AddDays(-1);

        return await db.Transactions
            .Include(t => t.Category)
            .Include(t => t.TransactionSource)
            .Where(t => t.UserId == userId && !t.IsDeleted
                     && t.TransactionDate >= from && t.TransactionDate <= to)
            .OrderByDescending(t => t.TransactionDate)
            .ThenByDescending(t => t.CreatedAt)
            .Select(t => ToDto(t))
            .ToListAsync();
    }

    public async Task<TransactionDto> GetByIdAsync(Guid userId, Guid transactionId)
    {
        var t = await db.Transactions
            .Include(t => t.Category)
            .Include(t => t.TransactionSource)
            .FirstOrDefaultAsync(t => t.Id == transactionId && t.UserId == userId && !t.IsDeleted)
            ?? throw new KeyNotFoundException("Transaction not found");

        return ToDto(t);
    }

    public async Task<TransactionDto> CreateAsync(Guid userId, CreateTransactionRequest request)
    {
        if (!Enum.TryParse<TransactionType>(request.TransactionType, out var txType))
            throw new ArgumentException($"Invalid transaction type: {request.TransactionType}");

        if (!Enum.TryParse<TransactionStatus>(request.TransactionStatus, out var txStatus))
            txStatus = TransactionStatus.Confirmed;

        if (request.Amount <= 0)
            throw new ArgumentException("Amount must be greater than zero");

        // Validate category ownership
        if (request.CategoryId.HasValue)
        {
            var catExists = await db.Categories.AnyAsync(c =>
                c.Id == request.CategoryId && c.UserId == userId && !c.IsArchived);
            if (!catExists) throw new ArgumentException("Category not found or does not belong to user");
        }

        // Validate source ownership
        var sourceExists = await db.TransactionSources.AnyAsync(s =>
            s.Id == request.TransactionSourceId && s.UserId == userId && !s.IsArchived);
        if (!sourceExists) throw new ArgumentException("Source not found or does not belong to user");

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CategoryId = request.CategoryId,
            TransactionSourceId = request.TransactionSourceId,
            TransactionType = txType,
            Amount = request.Amount,
            Description = request.Description?.Trim(),
            TransactionDate = request.TransactionDate ?? DateOnly.FromDateTime(DateTime.UtcNow),
            EntrySource = EntrySource.Manual,
            TransactionStatus = txStatus,
            CreatedAt = DateTime.UtcNow,
        };

        db.Transactions.Add(transaction);
        await db.SaveChangesAsync();

        return await GetByIdAsync(userId, transaction.Id);
    }

    public async Task<TransactionDto> UpdateAsync(Guid userId, Guid transactionId, UpdateTransactionRequest request)
    {
        var transaction = await db.Transactions
            .FirstOrDefaultAsync(t => t.Id == transactionId && t.UserId == userId && !t.IsDeleted)
            ?? throw new KeyNotFoundException("Transaction not found");

        if (request.TransactionType is not null && Enum.TryParse<TransactionType>(request.TransactionType, out var txType))
            transaction.TransactionType = txType;

        if (request.Amount.HasValue)
        {
            if (request.Amount <= 0) throw new ArgumentException("Amount must be greater than zero");
            transaction.Amount = request.Amount.Value;
        }

        if (request.Description is not null) transaction.Description = request.Description.Trim();
        if (request.TransactionDate.HasValue) transaction.TransactionDate = request.TransactionDate.Value;

        if (request.TransactionStatus is not null && Enum.TryParse<TransactionStatus>(request.TransactionStatus, out var txStatus))
            transaction.TransactionStatus = txStatus;

        if (request.CategoryId.HasValue)
        {
            var catExists = await db.Categories.AnyAsync(c =>
                c.Id == request.CategoryId && c.UserId == userId && !c.IsArchived);
            if (!catExists) throw new ArgumentException("Category not found");
            transaction.CategoryId = request.CategoryId;
        }

        if (request.TransactionSourceId.HasValue)
        {
            var srcExists = await db.TransactionSources.AnyAsync(s =>
                s.Id == request.TransactionSourceId && s.UserId == userId && !s.IsArchived);
            if (!srcExists) throw new ArgumentException("Source not found");
            transaction.TransactionSourceId = request.TransactionSourceId.Value;
        }

        transaction.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return await GetByIdAsync(userId, transaction.Id);
    }

    public async Task DeleteAsync(Guid userId, Guid transactionId)
    {
        var transaction = await db.Transactions
            .FirstOrDefaultAsync(t => t.Id == transactionId && t.UserId == userId && !t.IsDeleted)
            ?? throw new KeyNotFoundException("Transaction not found");

        transaction.IsDeleted = true;
        transaction.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }

    public async Task<TransactionDto> ConfirmAsync(Guid userId, Guid transactionId)
    {
        var transaction = await db.Transactions
            .FirstOrDefaultAsync(t => t.Id == transactionId && t.UserId == userId && !t.IsDeleted)
            ?? throw new KeyNotFoundException("Transaction not found");

        transaction.TransactionStatus = TransactionStatus.Confirmed;
        transaction.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return await GetByIdAsync(userId, transaction.Id);
    }

    public async Task<TransactionDto> SkipAsync(Guid userId, Guid transactionId)
    {
        var transaction = await db.Transactions
            .FirstOrDefaultAsync(t => t.Id == transactionId && t.UserId == userId && !t.IsDeleted)
            ?? throw new KeyNotFoundException("Transaction not found");

        transaction.TransactionStatus = TransactionStatus.Skipped;
        transaction.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return await GetByIdAsync(userId, transaction.Id);
    }

    internal static TransactionDto ToDto(Transaction t) => new(
        t.Id,
        t.TransactionType.ToString(),
        t.Amount,
        t.Description,
        t.TransactionDate,
        t.EntrySource.ToString(),
        t.TransactionStatus.ToString(),
        t.CategoryId,
        t.Category?.Name,
        t.TransactionSourceId,
        t.TransactionSource?.Name ?? "",
        t.TransactionSource?.SourceType.ToString() ?? "",
        t.CreatedAt
    );
}
