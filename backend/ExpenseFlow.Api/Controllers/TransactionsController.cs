using ExpenseFlow.Api.Extensions;
using ExpenseFlow.Application.DTOs;
using ExpenseFlow.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseFlow.Api.Controllers;

[ApiController]
[Route("api/transactions")]
[Authorize]
public class TransactionsController(
    ITransactionService transactionService,
    IUserService userService) : ControllerBase
{
    private async Task<Guid> GetUserIdAsync() =>
        (await userService.GetByClerkIdAsync(User.GetClerkUserId())
         ?? throw new UnauthorizedAccessException("User not synced")).Id;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? month)
    {
        var userId = await GetUserIdAsync();
        var (year, m) = ParseMonth(month);
        return Ok(await transactionService.GetTransactionsAsync(userId, year, m));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = await GetUserIdAsync();
        var tx = await transactionService.GetByIdAsync(userId, id);
        return Ok(tx);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTransactionRequest request)
    {
        var userId = await GetUserIdAsync();
        var tx = await transactionService.CreateAsync(userId, request);
        return CreatedAtAction(nameof(GetById), new { id = tx.Id }, tx);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTransactionRequest request)
    {
        var userId = await GetUserIdAsync();
        var tx = await transactionService.UpdateAsync(userId, id, request);
        return Ok(tx);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = await GetUserIdAsync();
        await transactionService.DeleteAsync(userId, id);
        return NoContent();
    }

    [HttpPut("{id:guid}/confirm")]
    public async Task<IActionResult> Confirm(Guid id)
    {
        var userId = await GetUserIdAsync();
        var tx = await transactionService.ConfirmAsync(userId, id);
        return Ok(tx);
    }

    [HttpPut("{id:guid}/skip")]
    public async Task<IActionResult> Skip(Guid id)
    {
        var userId = await GetUserIdAsync();
        var tx = await transactionService.SkipAsync(userId, id);
        return Ok(tx);
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
