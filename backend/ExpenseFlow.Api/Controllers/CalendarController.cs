using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseFlow.Api.Controllers;

[ApiController]
[Route("api/calendar")]
[Authorize]
public class CalendarController : ControllerBase
{
    [HttpGet("month")]
    public IActionResult Month([FromQuery] string? month) =>
        Ok(new { message = "Calendar month — not yet implemented", month });

    [HttpGet("day")]
    public IActionResult Day([FromQuery] string? date) =>
        Ok(new { message = "Calendar day — not yet implemented", date });
}
