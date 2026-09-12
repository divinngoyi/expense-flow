using System.Security.Claims;

namespace ExpenseFlow.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static string GetExternalAuthUserId(this ClaimsPrincipal user)
    {
        return user.FindFirstValue("sub")
            ?? user.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("External authentication user ID not found in token");
    }
}
