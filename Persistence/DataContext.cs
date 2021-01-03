using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Match> Matches { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Prediction> Predictions { get; set; }
        public DbSet<PredictionStatus> PredictionStatuses { get; set; } 
        public DbSet<Wagerer> Wagerers { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<UserPrediction> UserPredictions { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<MatchComment> MatchComments { get; set; }
        public DbSet<PaypalOrder> PaypalOrders { get; set; }

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

            modelBuilder.Entity<UserPrediction>(e =>
            {
                e.HasKey(up => new { up.WagererId, up.PredictionId });

                e.HasOne(up => up.Wagerer)
                 .WithMany(c => c.Predictions)
                 .HasForeignKey(up => up.WagererId);

                e.HasOne(up => up.Prediction)
                .WithMany(p => p.Predictors)
                .HasForeignKey(p => p.PredictionId);
            });

            modelBuilder.Entity<Prediction>(e =>
            {
                e.HasOne(x => x.Winner)
                .WithMany(x => x.WinningPredictions)
                .HasForeignKey(x => x.WinnerId);
            });


            /**********************************
            ***********************************
            **** MYSQL IDENTITY WORKAROUND ****
            ***********************************
            ***********************************/
            modelBuilder.Entity<IdentityUser>(entity => entity.Property(m => m.Id).HasMaxLength(85));
            modelBuilder.Entity<IdentityUser>(entity => entity.Property(m => m.NormalizedEmail).HasMaxLength(85));
            modelBuilder.Entity<IdentityUser>(entity => entity.Property(m => m.NormalizedUserName).HasMaxLength(85));

            modelBuilder.Entity<IdentityRole>(entity => entity.Property(m => m.Id).HasMaxLength(85));
            modelBuilder.Entity<IdentityRole>(entity => entity.Property(m => m.NormalizedName).HasMaxLength(85));

            modelBuilder.Entity<IdentityUserLogin<string>>(entity => entity.Property(m => m.LoginProvider).HasMaxLength(85));
            modelBuilder.Entity<IdentityUserLogin<string>>(entity => entity.Property(m => m.ProviderKey).HasMaxLength(85));
            modelBuilder.Entity<IdentityUserLogin<string>>(entity => entity.Property(m => m.UserId).HasMaxLength(85));
            modelBuilder.Entity<IdentityUserRole<string>>(entity => entity.Property(m => m.UserId).HasMaxLength(85));

            modelBuilder.Entity<IdentityUserRole<string>>(entity => entity.Property(m => m.RoleId).HasMaxLength(85));

            modelBuilder.Entity<IdentityUserToken<string>>(entity => entity.Property(m => m.UserId).HasMaxLength(85));
            modelBuilder.Entity<IdentityUserToken<string>>(entity => entity.Property(m => m.LoginProvider).HasMaxLength(85));
            modelBuilder.Entity<IdentityUserToken<string>>(entity => entity.Property(m => m.Name).HasMaxLength(85));

            modelBuilder.Entity<IdentityUserClaim<string>>(entity => entity.Property(m => m.Id).HasMaxLength(85));
            modelBuilder.Entity<IdentityUserClaim<string>>(entity => entity.Property(m => m.UserId).HasMaxLength(85));
            modelBuilder.Entity<IdentityRoleClaim<string>>(entity => entity.Property(m => m.Id).HasMaxLength(85));
            modelBuilder.Entity<IdentityRoleClaim<string>>(entity => entity.Property(m => m.RoleId).HasMaxLength(85));
        }

    }
}
