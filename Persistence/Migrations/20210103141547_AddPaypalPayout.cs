using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class AddPaypalPayout : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PaypalPayouts",
                columns: table => new
                {
                    BatchId = table.Column<string>(nullable: false),
                    WagererId = table.Column<string>(nullable: true),
                    RequestedAmount = table.Column<decimal>(nullable: false),
                    DeductedAmount = table.Column<decimal>(nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaypalPayouts", x => x.BatchId);
                    table.ForeignKey(
                        name: "FK_PaypalPayouts_Wagerers_WagererId",
                        column: x => x.WagererId,
                        principalTable: "Wagerers",
                        principalColumn: "AppUserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PaypalPayouts_WagererId",
                table: "PaypalPayouts",
                column: "WagererId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PaypalPayouts");
        }
    }
}
