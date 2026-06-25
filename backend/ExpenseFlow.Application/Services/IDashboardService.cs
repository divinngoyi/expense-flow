using ExpenseFlow.Application.DTOs;

namespace ExpenseFlow.Application.Services;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync(Guid userId, int year, int month);
    Task<List<CategoryBreakdownItemDto>> GetCategoryBreakdownAsync(Guid userId, int year, int month);
    Task<List<SourceBreakdownItemDto>> GetSourceBreakdownAsync(Guid userId, int year, int month);
}
