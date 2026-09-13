using ExpenseFlow.Application.DTOs;
using ExpenseFlow.Application.Services;
using ExpenseFlow.Domain.Entities;
using ExpenseFlow.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ExpenseFlow.Database.Services;

public class CategoryService(ExpenseFlowDbContext db) : ICategoryService
{
    public async Task<List<CategoryDto>> GetCategoriesAsync(Guid userId)
    {
        return await db.Categories
            .AsNoTracking()
            .Where(c => c.UserId == userId && !c.IsArchived)
            .OrderBy(c => c.Name)
            .Select(c => ToDto(c))
            .ToListAsync();
    }

    public async Task<CategoryDto> CreateCategoryAsync(Guid userId, CreateCategoryRequest request)
    {
        if (!Enum.TryParse<CategoryType>(request.CategoryType, out var categoryType))
            throw new ArgumentException($"Invalid category type: {request.CategoryType}");

        var category = new Category
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = request.Name.Trim(),
            CategoryType = categoryType,
            Description = request.Description?.Trim(),
            CreatedAt = DateTime.UtcNow,
        };

        db.Categories.Add(category);
        await db.SaveChangesAsync();
        return ToDto(category);
    }

    public async Task<CategoryDto> UpdateCategoryAsync(Guid userId, Guid categoryId, UpdateCategoryRequest request)
    {
        var category = await db.Categories
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.UserId == userId)
            ?? throw new KeyNotFoundException("Category not found");

        if (request.Name is not null) category.Name = request.Name.Trim();
        if (request.Description is not null) category.Description = request.Description.Trim();
        if (request.IsArchived.HasValue) category.IsArchived = request.IsArchived.Value;
        if (request.CategoryType is not null && Enum.TryParse<CategoryType>(request.CategoryType, out var ct))
            category.CategoryType = ct;

        category.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return ToDto(category);
    }

    public async Task DeleteCategoryAsync(Guid userId, Guid categoryId)
    {
        var category = await db.Categories
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.UserId == userId)
            ?? throw new KeyNotFoundException("Category not found");

        category.IsArchived = true;
        category.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }

    private static CategoryDto ToDto(Category c) =>
        new(c.Id, c.Name, c.CategoryType.ToString(), c.Description, c.IsSystemDefault, c.IsArchived, c.CreatedAt);
}
