﻿using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Interfaces;
using server.Models;
using System.Threading.Tasks;

namespace server.Repository
{
    public class AssignmentRepository : IAssignmentRepository
    {

        private readonly ApplicationDBContext db;
        public AssignmentRepository(ApplicationDBContext db)
        {
            this.db = db;
        }

        public async Task<IEnumerable<Assignment>> GetAllAssignments()
        {
            return await db.Assignments.ToListAsync();
        }

        public async Task<Assignment?> GetAssignmentById(int taskId)
        {
            return await db.Assignments.FirstOrDefaultAsync(n => n.Id == taskId);
        }
        public bool AssignmentExists(int taskId)
        {
            return db.Assignments.Any(n => n.Id == taskId);
        }

        public bool AssignmentExists(string title)
        {
            return db.Assignments.Any(n => n.Title.ToLower() == title.ToLower());
        }

        public bool AssignmentExists(string title, int taskId)
        {
            return db.Assignments.Any(n => n.Title.ToLower() == title.ToLower() && n.Id != taskId);
        }

        public async Task<bool> CreateAssignment(Assignment assignment)
        {
            await db.Assignments.AddAsync(assignment);
            return await Save();
        }


        public async Task<bool> RemoveAssignment(Assignment assignment)
        {
            db.Assignments.Remove(assignment);
            return await Save();
        }

        public async Task<bool> UpdateAssignment(Assignment assignment)
        {
            db.Assignments.Update(assignment);
            return await Save();
        }

        public async Task<bool> Save()
        {
            var saved = await db.SaveChangesAsync();
            return saved > 0 ? true : false;
        }
    }
}
