FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 10000
ENV ASPNETCORE_URLS=http://+:10000

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["ExpenseFlow.Api/ExpenseFlow.Api.csproj", "ExpenseFlow.Api/"]
COPY ["ExpenseFlow.Application/ExpenseFlow.Application.csproj", "ExpenseFlow.Application/"]
COPY ["ExpenseFlow.Domain/ExpenseFlow.Domain.csproj", "ExpenseFlow.Domain/"]
COPY ["ExpenseFlow.Infrastructure/ExpenseFlow.Infrastructure.csproj", "ExpenseFlow.Infrastructure/"]
COPY ["ExpenseFlow.Database/ExpenseFlow.Database.csproj", "ExpenseFlow.Database/"]
RUN dotnet restore "ExpenseFlow.Api/ExpenseFlow.Api.csproj"
COPY . .
WORKDIR "/src/ExpenseFlow.Api"
RUN dotnet build "ExpenseFlow.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ExpenseFlow.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ExpenseFlow.Api.dll"]
