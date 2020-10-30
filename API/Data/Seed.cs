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
                    Description = "Who will win the series?",
                    PredictionStatusId = PredictionStatus.Open
                },
                new Prediction
                {
                    Match = matches[1],
                    StartDate = matches[1].StartDate,
                    Title = "Series Winner",
                    Description = "Who will win the series?",
                    PredictionStatusId = PredictionStatus.Open
                },
                new Prediction
                {
                    Match = matches[2],
                    StartDate = matches[2].StartDate,
                    Title = "Series Winner",
                    Description = "Who will win the series?",
                    PredictionStatusId = PredictionStatus.Open
                },
            };

            foreach(var prediction in predictions)
            {
                ctx.Add(prediction);
            }

            ctx.SaveChanges();
        }

    }
}
