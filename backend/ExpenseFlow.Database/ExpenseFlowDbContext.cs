using ExpenseFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExpenseFlow.Database;

public class ExpenseFlowDbContext(DbContextOptions<ExpenseFlowDbContext> options) : DbContext(options)
{
    public DbSet<AppUser> AppUsers => Set<AppUser>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<TransactionSource> TransactionSources => Set<TransactionSource>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ExpenseFlowDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
