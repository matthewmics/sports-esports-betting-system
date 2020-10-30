using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class PopulatePredictionStatuses : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("INSERT INTO PredictionStatuses(Id, Name, DisplayText)" +
                "VALUES " +
                "(0, 'open', 'Open')," +
                "(1, 'settled', 'Settled')," +
                "(2, 'cancelled', 'Cancelled')");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
