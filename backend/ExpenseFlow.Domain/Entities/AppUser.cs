namespace ExpenseFlow.Domain.Entities;

public class AppUser
{
    public Guid Id { get; set; }
    public string ClerkUserId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public bool IsDeleted { get; set; }

    public ICollection<Category> Categories { get; set; } = [];
    public ICollection<TransactionSource> TransactionSources { get; set; } = [];
    public ICollection<Transaction> Transactions { get; set; } = [];
}
