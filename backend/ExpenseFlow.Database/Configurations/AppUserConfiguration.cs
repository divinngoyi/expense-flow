using ExpenseFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExpenseFlow.Database.Configurations;

public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder.ToTable("AppUsers");
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id).HasDefaultValueSql("gen_random_uuid()");
        builder.Property(u => u.ClerkUserId).IsRequired().HasMaxLength(256);
        builder.HasIndex(u => u.ClerkUserId).IsUnique();
        builder.Property(u => u.Email).IsRequired().HasMaxLength(320);
        builder.Property(u => u.DisplayName).HasMaxLength(256);
        builder.Property(u => u.CreatedAt).IsRequired();
        builder.Property(u => u.IsDeleted).HasDefaultValue(false);
    }
}
