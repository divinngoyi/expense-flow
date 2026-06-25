using ExpenseFlow.Application.DTOs;

namespace ExpenseFlow.Application.Services;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetCategoriesAsync(Guid userId);
    Task<CategoryDto> CreateCategoryAsync(Guid userId, CreateCategoryRequest request);
    Task<CategoryDto> UpdateCategoryAsync(Guid userId, Guid categoryId, UpdateCategoryRequest request);
    Task DeleteCategoryAsync(Guid userId, Guid categoryId);
}
