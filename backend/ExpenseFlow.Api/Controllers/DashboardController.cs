using ExpenseFlow.Api.Extensions;
using ExpenseFlow.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseFlow.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController(
    IDashboardService dashboardService,
    IUserService userService) : ControllerBase
{
    private async Task<Guid> GetUserIdAsync() =>
        (await userService.GetByExternalAuthIdAsync(User.GetExternalAuthUserId())
         ?? throw new UnauthorizedAccessException("User not synced")).Id;

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary([FromQuery] string? month)
    {
        var userId = await GetUserIdAsync();
        var (year, m) = ParseMonth(month);
        return Ok(await dashboardService.GetSummaryAsync(userId, year, m));
    }

    [HttpGet("category-breakdown")]
    public async Task<IActionResult> GetCategoryBreakdown([FromQuery] string? month)
    {
        var userId = await GetUserIdAsync();
        var (year, m) = ParseMonth(month);
        return Ok(await dashboardService.GetCategoryBreakdownAsync(userId, year, m));
    }

    [HttpGet("source-breakdown")]
    public async Task<IActionResult> GetSourceBreakdown([FromQuery] string? month)
    {
        var userId = await GetUserIdAsync();
        var (year, m) = ParseMonth(month);
        return Ok(await dashboardService.GetSourceBreakdownAsync(userId, year, m));
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
