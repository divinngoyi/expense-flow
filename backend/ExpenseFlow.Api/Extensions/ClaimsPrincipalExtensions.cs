using System.Security.Claims;

namespace ExpenseFlow.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static string GetClerkUserId(this ClaimsPrincipal user)
    {
        return user.FindFirstValue("sub")
            ?? user.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("Clerk user ID not found in token");
    }
}
