using ExpenseFlow.Application.DTOs;

namespace ExpenseFlow.Application.Services;

public interface ICalendarService
{
    Task<CalendarMonthDto> GetMonthAsync(Guid userId, int year, int month);
    Task<CalendarDayDetailDto> GetDayAsync(Guid userId, DateOnly date);
}
