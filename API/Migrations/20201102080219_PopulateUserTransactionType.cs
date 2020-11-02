using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class PopulateUserTransactionType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("INSERT INTO UserTransactionTypes(Id, Name, DisplayText)" +
                "VALUES " +
                "(0, 'cashIn', 'Cash In')," +
                "(1, 'cashOut', 'Cash Out')");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
