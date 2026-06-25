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
        var clerkId = User.GetClerkUserId();
        var user = await userService.GetByClerkIdAsync(clerkId);
        if (user is null) return NotFound(new { message = "User not found. Call /sync first." });
        return Ok(user);
    }

    [HttpPost("sync")]
    public async Task<IActionResult> Sync([FromBody] SyncUserRequest request)
    {
        // Override ClerkUserId from the JWT — never trust the body for identity
        var clerkId = User.GetClerkUserId();
        var email = User.FindFirst("email")?.Value ?? request.Email;
        var name = User.FindFirst("name")?.Value ?? request.DisplayName;

        var user = await userService.SyncUserAsync(new SyncUserRequest(clerkId, email, name));
        return Ok(user);
    }
}
