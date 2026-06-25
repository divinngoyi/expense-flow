using ExpenseFlow.Application.DTOs;
using ExpenseFlow.Application.Services;
using ExpenseFlow.Domain.Entities;
using ExpenseFlow.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ExpenseFlow.Database.Services;

public class TransactionSourceService(ExpenseFlowDbContext db) : ITransactionSourceService
{
    public async Task<List<TransactionSourceDto>> GetSourcesAsync(Guid userId)
    {
        return await db.TransactionSources
            .Where(s => s.UserId == userId && !s.IsArchived)
            .OrderBy(s => s.SourceType).ThenBy(s => s.Name)
            .Select(s => ToDto(s))
            .ToListAsync();
    }

    public async Task<TransactionSourceDto> CreateSourceAsync(Guid userId, CreateTransactionSourceRequest request)
    {
        if (!Enum.TryParse<SourceType>(request.SourceType, out var sourceType))
            throw new ArgumentException($"Invalid source type: {request.SourceType}");

        var source = new TransactionSource
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            SourceType = sourceType,
            Name = request.Name.Trim(),
            IsDefault = request.IsDefault,
            CreatedAt = DateTime.UtcNow,
        };

        db.TransactionSources.Add(source);
        await db.SaveChangesAsync();
        return ToDto(source);
    }

    public async Task<TransactionSourceDto> UpdateSourceAsync(Guid userId, Guid sourceId, UpdateTransactionSourceRequest request)
    {
        var source = await db.TransactionSources
            .FirstOrDefaultAsync(s => s.Id == sourceId && s.UserId == userId)
            ?? throw new KeyNotFoundException("Source not found");

        if (request.Name is not null) source.Name = request.Name.Trim();
        if (request.IsDefault.HasValue) source.IsDefault = request.IsDefault.Value;
        if (request.IsArchived.HasValue) source.IsArchived = request.IsArchived.Value;

        source.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return ToDto(source);
    }

    public async Task<TransactionSourceDto> GetOrCreateCashSourceAsync(Guid userId)
    {
        var cash = await db.TransactionSources
            .FirstOrDefaultAsync(s => s.UserId == userId && s.SourceType == SourceType.Cash && !s.IsArchived);

        if (cash is not null) return ToDto(cash);

        cash = new TransactionSource
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            SourceType = SourceType.Cash,
            Name = "Cash",
            IsDefault = true,
            CreatedAt = DateTime.UtcNow,
        };

        db.TransactionSources.Add(cash);
        await db.SaveChangesAsync();
        return ToDto(cash);
    }

    private static TransactionSourceDto ToDto(TransactionSource s) =>
        new(s.Id, s.SourceType.ToString(), s.Name, s.IsDefault, s.IsArchived);
}
