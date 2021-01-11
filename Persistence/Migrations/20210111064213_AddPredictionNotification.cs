using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.Data.EntityFrameworkCore.Metadata;

namespace Persistence.Migrations
{
    public partial class AddPredictionNotification : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PredictionNotification",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    WagererId = table.Column<string>(nullable: false),
                    PredictionId = table.Column<int>(nullable: false),
                    Read = table.Column<bool>(nullable: false),
                    Outcome = table.Column<decimal>(nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PredictionNotification", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PredictionNotification_Predictions_PredictionId",
                        column: x => x.PredictionId,
                        principalTable: "Predictions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PredictionNotification_Wagerers_WagererId",
                        column: x => x.WagererId,
                        principalTable: "Wagerers",
                        principalColumn: "AppUserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PredictionNotification_PredictionId",
                table: "PredictionNotification",
                column: "PredictionId");

            migrationBuilder.CreateIndex(
                name: "IX_PredictionNotification_WagererId",
                table: "PredictionNotification",
                column: "WagererId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PredictionNotification");
        }
    }
}
