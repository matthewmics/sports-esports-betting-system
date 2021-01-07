using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class AddWagererStats : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WagererStats",
                columns: table => new
                {
                    WagererId = table.Column<string>(nullable: false),
                    PredictionValue = table.Column<int>(nullable: false),
                    PredictionTotal = table.Column<int>(nullable: false),
                    MonthlyEarnings = table.Column<decimal>(nullable: false),
                    AllTimeEarnings = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WagererStats", x => x.WagererId);
                    table.ForeignKey(
                        name: "FK_WagererStats_Wagerers_WagererId",
                        column: x => x.WagererId,
                        principalTable: "Wagerers",
                        principalColumn: "AppUserId",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WagererStats");
        }
    }
}
