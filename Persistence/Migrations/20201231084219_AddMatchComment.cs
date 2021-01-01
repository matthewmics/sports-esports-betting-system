using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class AddMatchComment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MatchComments",
                columns: table => new
                {
                    Id = table.Column<byte[]>(nullable: false),
                    Message = table.Column<string>(nullable: true),
                    WagererId = table.Column<string>(nullable: false),
                    MatchId = table.Column<int>(nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MatchComments_Matches_MatchId",
                        column: x => x.MatchId,
                        principalTable: "Matches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MatchComments_Wagerers_WagererId",
                        column: x => x.WagererId,
                        principalTable: "Wagerers",
                        principalColumn: "AppUserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MatchComments_MatchId",
                table: "MatchComments",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchComments_WagererId",
                table: "MatchComments",
                column: "WagererId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MatchComments");
        }
    }
}
