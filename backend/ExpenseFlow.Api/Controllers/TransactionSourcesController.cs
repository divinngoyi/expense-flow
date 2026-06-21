using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseFlow.Api.Controllers;

[ApiController]
[Route("api/transaction-sources")]
[Authorize]
public class TransactionSourcesController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() =>
        Ok(new { message = "Transaction sources endpoint — not yet implemented" });

    [HttpPost]
    public IActionResult Create() =>
        StatusCode(501, new { message = "Create source — not yet implemented" });

    [HttpPut("{id:guid}")]
    public IActionResult Update(Guid id) =>
        StatusCode(501, new { message = "Update source — not yet implemented", id });
}
