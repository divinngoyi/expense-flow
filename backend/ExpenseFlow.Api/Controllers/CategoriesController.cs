using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseFlow.Api.Controllers;

[ApiController]
[Route("api/categories")]
[Authorize]
public class CategoriesController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() =>
        Ok(new { message = "Categories endpoint — not yet implemented" });

    [HttpPost]
    public IActionResult Create() =>
        StatusCode(501, new { message = "Create category — not yet implemented" });

    [HttpPut("{id:guid}")]
    public IActionResult Update(Guid id) =>
        StatusCode(501, new { message = "Update category — not yet implemented", id });

    [HttpDelete("{id:guid}")]
    public IActionResult Delete(Guid id) =>
        StatusCode(501, new { message = "Delete category — not yet implemented", id });
}
