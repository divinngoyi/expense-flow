namespace ExpenseFlow.Application.DTOs;

public record CalendarDayTotalDto(
    DateOnly Date,
    decimal MoneyIn,
    decimal MoneyOut,
    decimal Net,
    int TransactionCount
);

public record CalendarMonthDto(
    int Year,
    int Month,
    IReadOnlyList<CalendarDayTotalDto> Days
);

public record CalendarDayDetailDto(
    DateOnly Date,
    IReadOnlyList<TransactionDto> Transactions,
    decimal TotalMoneyIn,
    decimal TotalMoneyOut
);
