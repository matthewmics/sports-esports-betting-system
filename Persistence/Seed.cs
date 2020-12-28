using Domain;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Persistence
{
    public class Seed
    {

        private static readonly Random _rand = new Random();

        private class SeedUserModel
        {
            [JsonPropertyName("userName")]
            public string UserName { get; set; }
            [JsonPropertyName("displayName")]
            public string DisplayName { get; set; }
            [JsonPropertyName("email")]
            public string Email { get; set; }
        }
        private class SeedModel
        {
            [JsonPropertyName("teams")]
            public ICollection<Team> Teams { get; set; }
            [JsonPropertyName("users")]
            public ICollection<SeedUserModel> Users { get; set; }
        }

        public static void SeedData(DataContext ctx, UserManager<AppUser> userManager)
        {
            var dataSeedText = System.IO.File.ReadAllText("seed.json");
            var dataSeed = JsonSerializer.Deserialize<SeedModel>(dataSeedText);

            if (ctx.Teams.Any())
                return;

            foreach (var team in dataSeed.Teams)
            {
                team.CreatedAt = DateTime.Now.AddDays(-_rand.Next(10, 50));
                ctx.Add(team);
            }

            var matches = GenerateMatches(dataSeed.Teams);

            foreach (var match in matches)
            {
                ctx.Add(match);
            }

            foreach (var userWagerer in dataSeed.Users)
            {
                var appUser = new AppUser
                {
                    DisplayName = userWagerer.DisplayName,
                    Email = userWagerer.Email,
                    UserName=  userWagerer.Email
                };
                userManager.CreateAsync(appUser, "Password").Wait();
                ctx.Wagerers.Add(new Wagerer { AppUser = appUser });
            }

            var adminUser = new AppUser
            {
                DisplayName = "Zain Tuffin",
                Email = "tuffin@test.com",
                UserName = "admin"
            };
            userManager.CreateAsync(adminUser, "Pa$$word").Wait();
            ctx.Admins.Add(new Admin { AppUser = adminUser });

            ctx.SaveChanges();
        }

        private static List<Match> GenerateMatches(ICollection<Team> teams)
        {
            var result = new List<Match>();

            var dotaTeams = teams.Take(20).ToList();
            var csgoTeams = teams.Skip(20).Take(20).ToList();

            for (var i = 0; i < 12; i++)
            {
                dotaTeams.Shuffle();
                var eventName = i < 5 ? "StarLadder ImbaTV Dota 2 Minor" : "ONE Esports Dota 2";
                var days = _rand.Next(1, 6);
                var match = new Match
                {
                    Series = 3,
                    GameId = Game.Dota2,
                    EventName = eventName,
                    TeamA = dotaTeams[0],
                    TeamB = dotaTeams[1],
                    Predictions = Dota2Predictions(days)
                };
                result.Add(match);
            }

            for (var i = 0; i < 12; i++)
            {
                csgoTeams.Shuffle();
                var eventName = i < 5 ? "DreamHack Open Winter" : "BLAST Premier";
                var days = _rand.Next(1, 6);
                var match = new Match
                {
                    Series = 3,
                    GameId = Game.Csgo,
                    EventName = eventName,
                    TeamA = csgoTeams[0],
                    TeamB = csgoTeams[1],
                    Predictions = CSGOPredictions(days)
                };
                result.Add(match);
            }

            return result;
        }

        private static List<Prediction> Dota2Predictions(int days)
        {
            var result = new List<Prediction>()
            {
                new Prediction
                {
                    Sequence = 1,
                    Title = "Series Winner",
                    IsMain = true,
                    Description = "Which team will win the series?",
                    PredictionStatusId = PredictionStatus.Open,
                    StartDate = DateTime.Now.AddDays(days),
                },
                new Prediction
                {
                    Sequence = 2,
                    Title = "Game 1 Winner",
                    Description = "Which team will win game 1 of this series?",
                    PredictionStatusId = PredictionStatus.Open,
                    StartDate = DateTime.Now.AddDays(days),
                },
                new Prediction
                {
                    Sequence = 3,
                    Title = "Game 2 Winner",
                    Description = "Which team will win game 2 of this series?",
                    PredictionStatusId = PredictionStatus.Open,
                    StartDate = DateTime.Now.AddDays(days).AddHours(1),
                },
                new Prediction
                {
                    Sequence = 4,
                    Title = "Game 3 Winner",
                    Description = "Which team will win game 3 of this series?",
                    PredictionStatusId = PredictionStatus.Open,
                    StartDate = DateTime.Now.AddDays(days).AddHours(2),
                },
                new Prediction
                {
                    Sequence = 5,
                    Title = "Game 1 F10K",
                    Description = "Which team is the first to get 10 kills in game 1?",
                    PredictionStatusId = PredictionStatus.Open,
                    StartDate = DateTime.Now.AddDays(days),
                },
                new Prediction
                {
                    Sequence = 6,
                    Title = "Game 2 F10K",
                    Description = "Which team is the first to get 10 kills in game 2?",
                    PredictionStatusId = PredictionStatus.Open,
                    StartDate = DateTime.Now.AddDays(days).AddHours(1),
                },
                new Prediction
                {
                    Sequence = 7,
                    Title = "Game 3 F10K",
                    Description = "Which team is the first to get 10 kills in game 3?",
                    PredictionStatusId = PredictionStatus.Open,
                    StartDate = DateTime.Now.AddDays(days).AddHours(2),
                }
            };
            return result;
        }

        private static List<Prediction> CSGOPredictions(int days)
        {
            var result = new List<Prediction>()
            {
                new Prediction
                {
                    Sequence = 1,
                    Title = "Series Winner",
                    IsMain = true,
                    Description = "Which team will win the series?",
                    PredictionStatusId = PredictionStatus.Open,
                    StartDate = DateTime.Now.AddDays(days),
                },
                  new Prediction
                {
                    Sequence = 2,
                    Title = "Game 1 Winner",
                    Description = "Which team will win game 1 of this series?",
                    PredictionStatusId = PredictionStatus.Open,
                    StartDate = DateTime.Now.AddDays(days),
                },
                new Prediction
                {
                    Sequence = 3,
                    Title = "Game 2 Winner",
                    Description = "Which team will win game 2 of this series?",
                    PredictionStatusId = PredictionStatus.Open,
                    StartDate = DateTime.Now.AddDays(days).AddHours(1),
                },
                new Prediction
                {
                    Sequence = 4,
                    Title = "Game 3 Winner",
                    Description = "Which team will win game 3 of this series?",
                    PredictionStatusId = PredictionStatus.Open,
                    StartDate = DateTime.Now.AddDays(days).AddHours(2),
                },
            };
            return result;
        }

    }
}
