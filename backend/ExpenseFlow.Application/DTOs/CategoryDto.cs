namespace ExpenseFlow.Application.DTOs;

public record CategoryDto(
    Guid Id,
    string Name,
    string CategoryType,
    string? Description,
    bool IsSystemDefault,
    bool IsArchived,
    DateTime CreatedAt
);

public record CreateCategoryRequest(
    string Name,
    string CategoryType,
    string? Description
);

public record UpdateCategoryRequest(
    string? Name,
    string? CategoryType,
    string? Description,
    bool? IsArchived
);
