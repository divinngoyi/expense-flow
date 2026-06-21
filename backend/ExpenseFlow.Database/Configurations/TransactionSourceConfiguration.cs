using ExpenseFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExpenseFlow.Database.Configurations;

public class TransactionSourceConfiguration : IEntityTypeConfiguration<TransactionSource>
{
    public void Configure(EntityTypeBuilder<TransactionSource> builder)
    {
        builder.ToTable("TransactionSources");
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasDefaultValueSql("gen_random_uuid()");
        builder.Property(s => s.SourceType).IsRequired();
        builder.Property(s => s.Name).IsRequired().HasMaxLength(128);
        builder.Property(s => s.IsDefault).HasDefaultValue(false);
        builder.Property(s => s.IsArchived).HasDefaultValue(false);
        builder.Property(s => s.CreatedAt).IsRequired();

        builder.HasOne(s => s.User)
            .WithMany(u => u.TransactionSources)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
