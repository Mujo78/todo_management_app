using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class UserAssignmentTableUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_assignments_users_UserId",
                table: "assignments");

            migrationBuilder.DropForeignKey(
                name: "FK_refresh_tokens_users_UserId",
                table: "refresh_tokens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_users",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_refresh_tokens",
                table: "refresh_tokens");

            migrationBuilder.DropIndex(
                name: "IX_refresh_tokens_UserId",
                table: "refresh_tokens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_assignments",
                table: "assignments");

            migrationBuilder.DropIndex(
                name: "IX_assignments_UserId",
                table: "assignments");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "users");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "refresh_tokens");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "refresh_tokens");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "assignments");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "assignments");

            migrationBuilder.AddColumn<Guid>(
                name: "NewId",
                table: "users",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "users",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "NewId",
                table: "refresh_tokens",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "UserNewId",
                table: "refresh_tokens",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "NewId",
                table: "assignments",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "assignments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "assignments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "UserNewId",
                table: "assignments",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_users",
                table: "users",
                column: "NewId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_refresh_tokens",
                table: "refresh_tokens",
                column: "NewId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_assignments",
                table: "assignments",
                column: "NewId");

            migrationBuilder.CreateIndex(
                name: "IX_refresh_tokens_UserNewId",
                table: "refresh_tokens",
                column: "UserNewId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_assignments_UserNewId",
                table: "assignments",
                column: "UserNewId");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_assignments_users_UserNewId",
                table: "assignments");

            migrationBuilder.DropForeignKey(
                name: "FK_refresh_tokens_users_UserNewId",
                table: "refresh_tokens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_users",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_refresh_tokens",
                table: "refresh_tokens");

            migrationBuilder.DropIndex(
                name: "IX_refresh_tokens_UserNewId",
                table: "refresh_tokens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_assignments",
                table: "assignments");

            migrationBuilder.DropIndex(
                name: "IX_assignments_UserNewId",
                table: "assignments");

            migrationBuilder.DropColumn(
                name: "NewId",
                table: "users");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "users");

            migrationBuilder.DropColumn(
                name: "NewId",
                table: "refresh_tokens");

            migrationBuilder.DropColumn(
                name: "UserNewId",
                table: "refresh_tokens");

            migrationBuilder.DropColumn(
                name: "NewId",
                table: "assignments");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "assignments");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "assignments");

            migrationBuilder.DropColumn(
                name: "UserNewId",
                table: "assignments");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "users",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "refresh_tokens",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "refresh_tokens",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "assignments",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "assignments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_users",
                table: "users",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_refresh_tokens",
                table: "refresh_tokens",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_assignments",
                table: "assignments",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_refresh_tokens_UserId",
                table: "refresh_tokens",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_assignments_UserId",
                table: "assignments",
                column: "UserId");

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
    }
}
