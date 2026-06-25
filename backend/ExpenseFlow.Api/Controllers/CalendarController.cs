using ExpenseFlow.Api.Extensions;
using ExpenseFlow.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseFlow.Api.Controllers;

[ApiController]
[Route("api/calendar")]
[Authorize]
public class CalendarController(
    ICalendarService calendarService,
    IUserService userService) : ControllerBase
{
    private async Task<Guid> GetUserIdAsync() =>
        (await userService.GetByClerkIdAsync(User.GetClerkUserId())
         ?? throw new UnauthorizedAccessException("User not synced")).Id;

    [HttpGet("month")]
    public async Task<IActionResult> GetMonth([FromQuery] string? month)
    {
        var userId = await GetUserIdAsync();
        var (year, m) = ParseMonth(month);
        return Ok(await calendarService.GetMonthAsync(userId, year, m));
    }

    [HttpGet("day")]
    public async Task<IActionResult> GetDay([FromQuery] string? date)
    {
        var userId = await GetUserIdAsync();
        if (date is null || !DateOnly.TryParseExact(date, "yyyy-MM-dd", out var d))
            d = DateOnly.FromDateTime(DateTime.UtcNow);
        return Ok(await calendarService.GetDayAsync(userId, d));
    }

    private static (int year, int month) ParseMonth(string? month)
    {
        if (month is not null && DateTime.TryParseExact(month, "yyyy-MM",
            null, System.Globalization.DateTimeStyles.None, out var d))
            return (d.Year, d.Month);
        var now = DateTime.UtcNow;
        return (now.Year, now.Month);
    }
}
