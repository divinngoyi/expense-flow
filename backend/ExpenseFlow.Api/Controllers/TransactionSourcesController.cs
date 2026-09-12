using ExpenseFlow.Api.Extensions;
using ExpenseFlow.Application.DTOs;
using ExpenseFlow.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseFlow.Api.Controllers;

[ApiController]
[Route("api/transaction-sources")]
[Authorize]
public class TransactionSourcesController(
    ITransactionSourceService sourceService,
    IUserService userService) : ControllerBase
{
    private async Task<Guid> GetUserIdAsync() =>
        (await userService.GetByExternalAuthIdAsync(User.GetExternalAuthUserId())
         ?? throw new UnauthorizedAccessException("User not synced")).Id;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = await GetUserIdAsync();
        return Ok(await sourceService.GetSourcesAsync(userId));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTransactionSourceRequest request)
    {
        var userId = await GetUserIdAsync();
        var source = await sourceService.CreateSourceAsync(userId, request);
        return CreatedAtAction(nameof(GetAll), source);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTransactionSourceRequest request)
    {
        var userId = await GetUserIdAsync();
        var source = await sourceService.UpdateSourceAsync(userId, id, request);
        return Ok(source);
    }
}
