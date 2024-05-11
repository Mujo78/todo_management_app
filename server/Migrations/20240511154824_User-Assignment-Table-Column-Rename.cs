using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class UserAssignmentTableColumnRename : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_assignments_users_UserNewId",
                table: "assignments");

            migrationBuilder.DropForeignKey(
                name: "FK_refresh_tokens_users_UserNewId",
                table: "refresh_tokens");

            migrationBuilder.RenameColumn(
                name: "NewId",
                table: "users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "UserNewId",
                table: "refresh_tokens",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "NewId",
                table: "refresh_tokens",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_refresh_tokens_UserNewId",
                table: "refresh_tokens",
                newName: "IX_refresh_tokens_UserId");

            migrationBuilder.RenameColumn(
                name: "UserNewId",
                table: "assignments",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "NewId",
                table: "assignments",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_assignments_UserNewId",
                table: "assignments",
                newName: "IX_assignments_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_assignments_users_UserId",
                table: "assignments",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_refresh_tokens_users_UserId",
                table: "refresh_tokens",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_assignments_users_UserId",
                table: "assignments");

            migrationBuilder.DropForeignKey(
                name: "FK_refresh_tokens_users_UserId",
                table: "refresh_tokens");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "users",
                newName: "NewId");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "refresh_tokens",
                newName: "UserNewId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "refresh_tokens",
                newName: "NewId");

            migrationBuilder.RenameIndex(
                name: "IX_refresh_tokens_UserId",
                table: "refresh_tokens",
                newName: "IX_refresh_tokens_UserNewId");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "assignments",
                newName: "UserNewId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "assignments",
                newName: "NewId");

            migrationBuilder.RenameIndex(
                name: "IX_assignments_UserId",
                table: "assignments",
                newName: "IX_assignments_UserNewId");

            migrationBuilder.AddForeignKey(
                name: "FK_assignments_users_UserNewId",
                table: "assignments",
                column: "UserNewId",
                principalTable: "users",
                principalColumn: "NewId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_refresh_tokens_users_UserNewId",
                table: "refresh_tokens",
                column: "UserNewId",
                principalTable: "users",
                principalColumn: "NewId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
