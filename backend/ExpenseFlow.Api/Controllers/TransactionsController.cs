using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseFlow.Api.Controllers;

[ApiController]
[Route("api/transactions")]
[Authorize]
public class TransactionsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll([FromQuery] string? month) =>
        Ok(new { message = "Transactions endpoint — not yet implemented", month });

    [HttpGet("{id:guid}")]
    public IActionResult GetById(Guid id) =>
        Ok(new { message = "Get transaction — not yet implemented", id });

    [HttpPost]
    public IActionResult Create() =>
        StatusCode(501, new { message = "Create transaction — not yet implemented" });

    [HttpPut("{id:guid}")]
    public IActionResult Update(Guid id) =>
        StatusCode(501, new { message = "Update transaction — not yet implemented", id });

    [HttpDelete("{id:guid}")]
    public IActionResult Delete(Guid id) =>
        StatusCode(501, new { message = "Delete transaction — not yet implemented", id });

    [HttpPut("{id:guid}/confirm")]
    public IActionResult Confirm(Guid id) =>
        StatusCode(501, new { message = "Confirm transaction — not yet implemented", id });

    [HttpPut("{id:guid}/skip")]
    public IActionResult Skip(Guid id) =>
        StatusCode(501, new { message = "Skip transaction — not yet implemented", id });
}
