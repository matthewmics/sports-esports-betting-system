using API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Match> Matches { get; set; }
        public DbSet<Team> Teams { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Match>(e =>
            {
                e.HasKey(m => m.Id);

                e.HasOne(m => m.TeamA)
                .WithMany(t => t.TeamAMatches)
                .HasForeignKey(m => m.TeamAId);

                e.HasOne(m => m.TeamB)
                .WithMany(t => t.TeamBMatches)
                .HasForeignKey(m => m.TeamBId);
            });
        }

    }
}
