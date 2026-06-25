using ExpenseFlow.Application.DTOs;
using ExpenseFlow.Application.Services;
using ExpenseFlow.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ExpenseFlow.Database.Services;

public class DashboardService(ExpenseFlowDbContext db) : IDashboardService
{
    public async Task<DashboardSummaryDto> GetSummaryAsync(Guid userId, int year, int month)
    {
        var from = new DateOnly(year, month, 1);
        var to = from.AddMonths(1).AddDays(-1);
        var prevFrom = from.AddMonths(-1);
        var prevTo = from.AddDays(-1);

        var confirmed = db.Transactions.Where(t =>
            t.UserId == userId && !t.IsDeleted &&
            t.TransactionStatus == TransactionStatus.Confirmed);

        var current = await confirmed
            .Where(t => t.TransactionDate >= from && t.TransactionDate <= to)
            .GroupBy(t => t.TransactionType)
            .Select(g => new { Type = g.Key, Total = g.Sum(t => t.Amount) })
            .ToListAsync();

        var previous = await confirmed
            .Where(t => t.TransactionDate >= prevFrom && t.TransactionDate <= prevTo)
            .GroupBy(t => t.TransactionType)
            .Select(g => new { Type = g.Key, Total = g.Sum(t => t.Amount) })
            .ToListAsync();

        var moneyIn = current.FirstOrDefault(x => x.Type == TransactionType.MoneyIn)?.Total ?? 0;
        var moneyOut = current.FirstOrDefault(x => x.Type == TransactionType.MoneyOut)?.Total ?? 0;
        var prevIn = previous.FirstOrDefault(x => x.Type == TransactionType.MoneyIn)?.Total ?? 0;
        var prevOut = previous.FirstOrDefault(x => x.Type == TransactionType.MoneyOut)?.Total ?? 0;

        decimal? inChange = prevIn > 0 ? Math.Round((moneyIn - prevIn) / prevIn * 100, 1) : null;
        decimal? outChange = prevOut > 0 ? Math.Round((moneyOut - prevOut) / prevOut * 100, 1) : null;
        var prevNet = prevIn - prevOut;
        decimal? netVsLast = prevNet != 0 ? Math.Round((moneyIn - moneyOut) - prevNet, 2) : null;

        return new DashboardSummaryDto(moneyIn, moneyOut, moneyIn - moneyOut, inChange, outChange, netVsLast, year, month);
    }

    public async Task<List<CategoryBreakdownItemDto>> GetCategoryBreakdownAsync(Guid userId, int year, int month)
    {
        var from = new DateOnly(year, month, 1);
        var to = from.AddMonths(1).AddDays(-1);

        return await db.Transactions
            .Include(t => t.Category)
            .Where(t => t.UserId == userId && !t.IsDeleted
                     && t.TransactionStatus == TransactionStatus.Confirmed
                     && t.TransactionType == TransactionType.MoneyOut
                     && t.TransactionDate >= from && t.TransactionDate <= to
                     && t.CategoryId != null)
            .GroupBy(t => new { t.CategoryId, t.Category!.Name })
            .Select(g => new CategoryBreakdownItemDto(
                g.Key.CategoryId!.Value,
                g.Key.Name,
                g.Sum(t => t.Amount),
                g.Count()))
            .OrderByDescending(x => x.Total)
            .ToListAsync();
    }

    public async Task<List<SourceBreakdownItemDto>> GetSourceBreakdownAsync(Guid userId, int year, int month)
    {
        var from = new DateOnly(year, month, 1);
        var to = from.AddMonths(1).AddDays(-1);

        return await db.Transactions
            .Include(t => t.TransactionSource)
            .Where(t => t.UserId == userId && !t.IsDeleted
                     && t.TransactionStatus == TransactionStatus.Confirmed
                     && t.TransactionDate >= from && t.TransactionDate <= to)
            .GroupBy(t => new { t.TransactionSourceId, t.TransactionSource!.Name, t.TransactionSource.SourceType })
            .Select(g => new SourceBreakdownItemDto(
                g.Key.TransactionSourceId,
                g.Key.Name,
                g.Key.SourceType.ToString(),
                g.Where(t => t.TransactionType == TransactionType.MoneyIn).Sum(t => t.Amount),
                g.Where(t => t.TransactionType == TransactionType.MoneyOut).Sum(t => t.Amount)))
            .ToListAsync();
    }
}
