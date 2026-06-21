using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseFlow.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    [HttpGet("me")]
    public IActionResult GetMe()
    {
        var clerkUserId = User.FindFirst("sub")?.Value;
        return Ok(new { clerkUserId, message = "User endpoint — sync not yet implemented" });
    }

    [HttpPost("sync")]
    public IActionResult Sync()
    {
        return Ok(new { message = "Sync not yet implemented" });
    }
}
