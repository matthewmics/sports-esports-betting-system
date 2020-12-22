using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class AddOrderToPredictionStatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<short>(
                name: "Order",
                table: "PredictionStatuses",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.Sql("UPDATE PredictionStatuses SET `Order` = 0 WHERE Name='live'");
            migrationBuilder.Sql("UPDATE PredictionStatuses SET `Order` = 1 WHERE Name='open'");
            migrationBuilder.Sql("UPDATE PredictionStatuses SET `Order` = 2 WHERE Name='cancelled'");
            migrationBuilder.Sql("UPDATE PredictionStatuses SET `Order` = 2 WHERE Name='settled'");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Order",
                table: "PredictionStatuses");
        }
    }
}
