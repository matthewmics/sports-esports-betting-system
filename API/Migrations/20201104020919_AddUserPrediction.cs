using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class AddUserPrediction : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserPredictions",
                columns: table => new
                {
                    CustomerId = table.Column<string>(nullable: false),
                    PredictionId = table.Column<int>(nullable: false),
                    Amount = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPredictions", x => new { x.CustomerId, x.PredictionId });
                    table.ForeignKey(
                        name: "FK_UserPredictions_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "AppUserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserPredictions_Predictions_PredictionId",
                        column: x => x.PredictionId,
                        principalTable: "Predictions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserPredictions_PredictionId",
                table: "UserPredictions",
                column: "PredictionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserPredictions");
        }
    }
}
