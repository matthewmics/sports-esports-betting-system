using API.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Data
{
    public class Seed
    {
        public static void SeedData(DataContext ctx, UserManager<AppUser> userManager)
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

            foreach (var team in teams)
            {
                ctx.Add(team);
            }

            var matches = new List<Match>
            {
                new Match
                {
                    Category = "dota2",
                    EventName = "ESL ONE",
                    StartDate = DateTime.Now.AddDays(1),
                    TeamA = teams[0], TeamB = teams[1],
                },
                new Match
                {
                    Category = "dota2",
                    EventName = "ESL ONE",
                    StartDate = DateTime.Now.AddDays(2),
                    TeamA = teams[0], TeamB = teams[2],
                },
                new Match
                {
                    Category = "dota2",
                    EventName = "ESL ONE",
                    StartDate = DateTime.Now.AddDays(2),
                    TeamA = teams[1], TeamB = teams[2],
                },
            };

            foreach (var match in matches)
            {
                ctx.Add(match);
            }

            var predictions = new List<Prediction>
            {
                new Prediction
                {
                    Match = matches[0],
                    StartDate = matches[0].StartDate,
                    Title = "Series Winner",
                    Description = "Which team will win the series?",
                    PredictionStatusId = PredictionStatus.Open
                },
                new Prediction
                {
                    Match = matches[0],
                    StartDate = matches[0].StartDate,
                    Title = "Game 1 Winner",
                    Description = "Which team will win Game 1?",
                    PredictionStatusId = PredictionStatus.Open
                },
                new Prediction
                {
                    Match = matches[1],
                    StartDate = matches[1].StartDate,
                    Title = "Series Winner",
                    Description = "Which team will win the series?",
                    PredictionStatusId = PredictionStatus.Open
                },
                new Prediction
                {
                    Match = matches[2],
                    StartDate = matches[2].StartDate,
                    Title = "Series Winner",
                    Description = "Which team will win the series?",
                    PredictionStatusId = PredictionStatus.Open
                },
            };

            foreach (var prediction in predictions)
            {
                ctx.Add(prediction);
            }

            var userCustomers = new List<AppUser>
            {
                new AppUser
                {
                    DisplayName = "Dejounte Mitchell",
                    Email = "dejounte@test.com",
                    UserName = "dejounte06"
                },
                new AppUser
                {
                    DisplayName = "Jayson Hayward",
                    Email = "jayson@test.com",
                    UserName = "jayson06"
                },
            };

            foreach (var userCustomer in userCustomers)
            {
                userManager.CreateAsync(userCustomer, "Password").Wait();
                ctx.Customers.Add(new Customer { AppUser = userCustomer });
            }

            ctx.SaveChanges();
        }

    }
}
