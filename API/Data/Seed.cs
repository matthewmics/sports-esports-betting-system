using API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Data
{
    public class Seed
    {
        public static void SeedData(DataContext ctx)
        {

            if (ctx.Teams.Any())
                return;

            var teams = new List<Team>
            {
                new Team
                {
                    Image = null,
                    Name = "Team Secret"
                },
                new Team
                {
                    Image = null,
                    Name = "Nigma"
                },
                new Team
                {
                    Image = null,
                    Name = "Virtus Pro"
                },
            };

            foreach(var team in teams)
            {
                ctx.Add(team);
            }

            ctx.SaveChanges();
        }

    }
}
