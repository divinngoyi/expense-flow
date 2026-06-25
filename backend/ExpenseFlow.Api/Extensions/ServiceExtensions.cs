using ExpenseFlow.Application.Services;
using ExpenseFlow.Database.Services;

namespace ExpenseFlow.Api.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<ITransactionSourceService, TransactionSourceService>();
        services.AddScoped<ITransactionService, TransactionService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<ICalendarService, CalendarService>();
        return services;
    }
}
