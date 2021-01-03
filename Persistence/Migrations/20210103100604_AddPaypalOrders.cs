using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class AddPaypalOrders : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PaypalOrders",
                columns: table => new
                {
                    OrderCode = table.Column<string>(nullable: false),
                    WagererId = table.Column<string>(nullable: true),
                    Amount = table.Column<decimal>(nullable: false),
                    AmountWithFees = table.Column<decimal>(nullable: false),
                    IsCaptured = table.Column<bool>(nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    CapturedDate = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaypalOrders", x => x.OrderCode);
                    table.ForeignKey(
                        name: "FK_PaypalOrders_Wagerers_WagererId",
                        column: x => x.WagererId,
                        principalTable: "Wagerers",
                        principalColumn: "AppUserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PaypalOrders_WagererId",
                table: "PaypalOrders",
                column: "WagererId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PaypalOrders");
        }
    }
}
