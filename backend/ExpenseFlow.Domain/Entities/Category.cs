using ExpenseFlow.Domain.Enums;

namespace ExpenseFlow.Domain.Entities;

public class Category
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public CategoryType CategoryType { get; set; }
    public string? Description { get; set; }
    public bool IsSystemDefault { get; set; }
    public bool IsArchived { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public AppUser User { get; set; } = null!;
    public ICollection<Transaction> Transactions { get; set; } = [];
}
