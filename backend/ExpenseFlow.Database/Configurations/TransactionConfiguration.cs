using ExpenseFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExpenseFlow.Database.Configurations;

public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.ToTable("Transactions");
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Id).HasDefaultValueSql("gen_random_uuid()");
        builder.Property(t => t.TransactionType).IsRequired();
        builder.Property(t => t.Amount).IsRequired().HasColumnType("numeric(18,2)");
        builder.Property(t => t.Description).HasMaxLength(512);
        builder.Property(t => t.TransactionDate).IsRequired();
        builder.Property(t => t.EntrySource).IsRequired();
        builder.Property(t => t.TransactionStatus).IsRequired();
        builder.Property(t => t.CreatedAt).IsRequired();
        builder.Property(t => t.IsDeleted).HasDefaultValue(false);

        builder.HasOne(t => t.User)
            .WithMany(u => u.Transactions)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(t => t.Category)
            .WithMany(c => c.Transactions)
            .HasForeignKey(t => t.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(t => t.TransactionSource)
            .WithMany(s => s.Transactions)
            .HasForeignKey(t => t.TransactionSourceId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
