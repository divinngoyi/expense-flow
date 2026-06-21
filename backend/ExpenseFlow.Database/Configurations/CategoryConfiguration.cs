using ExpenseFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExpenseFlow.Database.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Categories");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasDefaultValueSql("gen_random_uuid()");
        builder.Property(c => c.Name).IsRequired().HasMaxLength(128);
        builder.Property(c => c.CategoryType).IsRequired();
        builder.Property(c => c.Description).HasMaxLength(512);
        builder.Property(c => c.IsSystemDefault).HasDefaultValue(false);
        builder.Property(c => c.IsArchived).HasDefaultValue(false);
        builder.Property(c => c.CreatedAt).IsRequired();

        builder.HasOne(c => c.User)
            .WithMany(u => u.Categories)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
