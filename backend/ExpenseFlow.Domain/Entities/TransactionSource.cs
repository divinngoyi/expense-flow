using ExpenseFlow.Domain.Enums;

namespace ExpenseFlow.Domain.Entities;

public class TransactionSource
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public SourceType SourceType { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
    public bool IsArchived { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public AppUser User { get; set; } = null!;
    public ICollection<Transaction> Transactions { get; set; } = [];
}
