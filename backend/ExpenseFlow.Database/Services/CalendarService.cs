using ExpenseFlow.Application.DTOs;
using ExpenseFlow.Application.Services;
using ExpenseFlow.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ExpenseFlow.Database.Services;

public class CalendarService(ExpenseFlowDbContext db) : ICalendarService
{
    public async Task<CalendarMonthDto> GetMonthAsync(Guid userId, int year, int month)
    {
        var from = new DateOnly(year, month, 1);
        var to = from.AddMonths(1).AddDays(-1);

        var daily = await db.Transactions
            .Where(t => t.UserId == userId && !t.IsDeleted
                     && t.TransactionStatus == TransactionStatus.Confirmed
                     && t.TransactionDate >= from && t.TransactionDate <= to)
            .GroupBy(t => t.TransactionDate)
            .Select(g => new
            {
                Date = g.Key,
                MoneyIn = g.Where(t => t.TransactionType == TransactionType.MoneyIn).Sum(t => t.Amount),
                MoneyOut = g.Where(t => t.TransactionType == TransactionType.MoneyOut).Sum(t => t.Amount),
                Count = g.Count(),
            })
            .ToListAsync();

        var days = daily
            .Select(d => new CalendarDayTotalDto(d.Date, d.MoneyIn, d.MoneyOut, d.MoneyIn - d.MoneyOut, d.Count))
            .OrderBy(d => d.Date)
            .ToList();

        return new CalendarMonthDto(year, month, days);
    }

    public async Task<CalendarDayDetailDto> GetDayAsync(Guid userId, DateOnly date)
    {
        var transactions = await db.Transactions
            .Include(t => t.Category)
            .Include(t => t.TransactionSource)
            .Where(t => t.UserId == userId && !t.IsDeleted && t.TransactionDate == date)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        var dtos = transactions.Select(TransactionService.ToDto).ToList();
        var moneyIn = transactions.Where(t => t.TransactionType == TransactionType.MoneyIn && t.TransactionStatus == TransactionStatus.Confirmed).Sum(t => t.Amount);
        var moneyOut = transactions.Where(t => t.TransactionType == TransactionType.MoneyOut && t.TransactionStatus == TransactionStatus.Confirmed).Sum(t => t.Amount);

        return new CalendarDayDetailDto(date, dtos, moneyIn, moneyOut);
    }
}
