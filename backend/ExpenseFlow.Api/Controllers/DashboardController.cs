using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseFlow.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    [HttpGet("summary")]
    public IActionResult Summary([FromQuery] string? month) =>
        Ok(new { message = "Dashboard summary — not yet implemented", month });

    [HttpGet("category-breakdown")]
    public IActionResult CategoryBreakdown([FromQuery] string? month) =>
        Ok(new { message = "Category breakdown — not yet implemented", month });

    [HttpGet("source-breakdown")]
    public IActionResult SourceBreakdown([FromQuery] string? month) =>
        Ok(new { message = "Source breakdown — not yet implemented", month });
}
