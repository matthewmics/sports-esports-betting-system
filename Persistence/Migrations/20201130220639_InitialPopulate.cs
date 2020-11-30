using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class InitialPopulate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("INSERT INTO PredictionStatuses(Id, Name, DisplayText)" +
               "VALUES " +
               "(0, 'open', 'Open')," +
               "(1, 'settled', 'Settled')," +
               "(2, 'cancelled', 'Cancelled')");

            migrationBuilder.Sql("INSERT INTO UserTransactionTypes(Id, Name, DisplayText)" +
               "VALUES " +
               "(0, 'cashIn', 'Cash In')," +
               "(1, 'cashOut', 'Cash Out')");

            migrationBuilder.Sql("INSERT INTO Games(Id, Name, DisplayText)" +
               "VALUES " +
               "(0, 'dota2', 'Dota 2')," +
               "(1, 'csgo', 'CSGO')," +
               "(2, 'sports', 'Sports')");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
