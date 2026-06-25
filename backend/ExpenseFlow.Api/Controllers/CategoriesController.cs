using ExpenseFlow.Api.Extensions;
using ExpenseFlow.Application.DTOs;
using ExpenseFlow.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseFlow.Api.Controllers;

[ApiController]
[Route("api/categories")]
[Authorize]
public class CategoriesController(ICategoryService categoryService, IUserService userService) : ControllerBase
{
    private async Task<Guid> GetUserIdAsync() =>
        (await userService.GetByClerkIdAsync(User.GetClerkUserId())
         ?? throw new UnauthorizedAccessException("User not synced")).Id;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = await GetUserIdAsync();
        return Ok(await categoryService.GetCategoriesAsync(userId));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryRequest request)
    {
        var userId = await GetUserIdAsync();
        var category = await categoryService.CreateCategoryAsync(userId, request);
        return CreatedAtAction(nameof(GetAll), category);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCategoryRequest request)
    {
        var userId = await GetUserIdAsync();
        var category = await categoryService.UpdateCategoryAsync(userId, id, request);
        return Ok(category);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = await GetUserIdAsync();
        await categoryService.DeleteCategoryAsync(userId, id);
        return NoContent();
    }
}
