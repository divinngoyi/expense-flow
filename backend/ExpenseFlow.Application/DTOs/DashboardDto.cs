namespace ExpenseFlow.Application.DTOs;

public record DashboardSummaryDto(
    decimal TotalMoneyIn,
    decimal TotalMoneyOut,
    decimal NetFlow,
    decimal? MoneyInChangePercent,
    decimal? MoneyOutChangePercent,
    decimal? NetFlowVsLastMonth,
    int Year,
    int Month
);

public record CategoryBreakdownItemDto(
    Guid CategoryId,
    string CategoryName,
    decimal Total,
    int Count
);

public record SourceBreakdownItemDto(
    Guid SourceId,
    string SourceName,
    string SourceType,
    decimal MoneyIn,
    decimal MoneyOut
);
