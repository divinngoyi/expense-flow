using ExpenseFlow.Domain.Enums;

namespace ExpenseFlow.Domain.Entities;

public class Transaction
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid TransactionSourceId { get; set; }
    public TransactionType TransactionType { get; set; }
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public DateOnly TransactionDate { get; set; }
    public EntrySource EntrySource { get; set; }
    public TransactionStatus TransactionStatus { get; set; }
    public Guid? RecurringTransactionId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }

    public AppUser User { get; set; } = null!;
    public Category? Category { get; set; }
    public TransactionSource TransactionSource { get; set; } = null!;
}
