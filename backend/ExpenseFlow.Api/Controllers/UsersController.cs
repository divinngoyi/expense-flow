using ExpenseFlow.Api.Extensions;
using ExpenseFlow.Application.DTOs;
using ExpenseFlow.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseFlow.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController(IUserService userService) : ControllerBase
{
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var externalAuthUserId = User.GetExternalAuthUserId();
        var user = await userService.GetByExternalAuthIdAsync(externalAuthUserId);
        if (user is null) return NotFound(new { message = "User not found. Call /sync first." });
        return Ok(user);
    }

    [HttpPost("sync")]
    public async Task<IActionResult> Sync([FromBody] SyncUserRequest request)
    {
        // Override ExternalAuthUserId from the JWT — never trust the body for identity
        var externalAuthUserId = User.GetExternalAuthUserId();
        var email = User.FindFirst("email")?.Value ?? request.Email;
        var name = User.FindFirst("name")?.Value ?? request.DisplayName;

        var user = await userService.SyncUserAsync(new SyncUserRequest(externalAuthUserId, email, name));
        return Ok(user);
    }
}
