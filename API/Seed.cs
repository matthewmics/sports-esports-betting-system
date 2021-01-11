using Application.Paypal;
using Application.Prediction;
using Domain;
using Microsoft.AspNetCore.Identity;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API
{
    public class Seed
    {
        /******************************************
         * ****************************************
         * THESE WILL BE SET TO NULL AFTER SEEDING
         * ****************************************
         ******************************************/
        private static Random _rand = new Random();
        private static List<string> _comments = new List<string>
        {
            "{0} vs {1}. I have been waiting for this match",
            "{0} got this", "In {1} I trust", "Admin please start the game already. {0} odds are getting bad",
            "I think {1} will win it this time", "Where to bet guys? {1} is on fire lately",
            "{1} have a hard time when against {0}", "I think it's better to skip this match",
            "{1} have some good odds, I'll place a small bet on them", "I always lose every time I bet on {0}",
            "{0} has not yet won against {1}", "{1} please win it this time. I still trust you",
            "Still trust {1} ? They have costed me a lot already",
            "{1} finally going up against {0}. This will be interesting, I don't know where to bet",
            "I'd love to bet on {1}, but unfortunately the odds aren't that good",
            "I think this match has been cancelled", "{1} vs {0}. Should be an easy win for {1}",
            "Can't believe a lot bet on {1}. {0} is a strong team", "{1} has to win this badly if they want to qualify",
            "Better to skip this. {1} qualified already, they might throw",
            "Bet on {0}, thank me later", "I don't believe {1} can win this", "Just in time for {0} vs {1}",
            "Both are good teams, I'll go with {1}, bet at your own risk", "This can go either way, bet on the better odds",
            "Go small bet on {0}, the odds are good on them", "has {0} ever won against {1} ?",
            "I'm going all in on {1}. If they lose imma stop already.", "Had I not lost my last prediction, I would have gone all in on {0}"
        };
        /******************************************/

        public static void SeedData(DataContext ctx, UserManager<AppUser> userManager, IPredictionOddsReader oddsReader)
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

            ctx.Matches.AddRange(GenerateMatches(dataSeed.Teams));

            foreach (var userWagerer in dataSeed.Users)
            {
                var appUser = new AppUser
                {
                    DisplayName = userWagerer.DisplayName,
                    Email = userWagerer.Email,
                    UserName = userWagerer.Email
                };

                userManager.CreateAsync(appUser, "Password").Wait();
                userManager.AddClaimAsync(appUser, new Claim(ClaimTypes.Email, userWagerer.Email)).Wait();

                var wagerer = new Wagerer { AppUser = appUser };
                ctx.Wagerers.Add(wagerer);
            }

            ctx.UserPredictions.AddRange(GenerateUserPredictions(ctx));
            ctx.MatchComments.AddRange(GenerateMatchComments(ctx));
            ctx.PaypalOrders.AddRange(GenerateDeposits(ctx));
            ctx.PaypalPayouts.AddRange(GenerateWithdraws(ctx));


            var adminUser = new AppUser
            {
                DisplayName = "Admin",
                Email = "admin@test.com",
                UserName = "admin@test.com"
            };
            userManager.CreateAsync(adminUser, "P@ssword").Wait();
            userManager.AddClaimAsync(adminUser, new Claim(ClaimTypes.Email, adminUser.Email)).Wait();
            ctx.Admins.Add(new Admin { AppUser = adminUser });

            ctx.SaveChanges();
            SetFinalOdds(ctx, oddsReader);

            // cleanup
            _rand = null;
            _comments = null;
        }



        private static IEnumerable<PaypalOrder> GenerateDeposits(DataContext context)
        {
            var wagerers = context.Wagerers.ToList();

            foreach (var wagerer in wagerers)
            {
                for(var i = 0; i < 10; i++)
                {
                    var randomSeconds = -_rand.Next(720);
                    var randomDays = -_rand.Next(5);
                    int randomAmount = _rand.Next(2_000, 2_500);
                    yield return new PaypalOrder
                    {
                        IsCaptured = true,
                        CapturedDate = DateTime.Now.AddDays(randomDays).AddSeconds(randomSeconds),
                        CreatedAt = DateTime.Now.AddDays(randomDays).AddSeconds(randomSeconds + 30),
                        Wagerer = wagerer,
                        Amount = randomAmount,
                        AmountWithFees = randomAmount.AddPaypalFees(),
                        OrderCode = "seeded-" + Guid.NewGuid().ToString(),
                    };
                }
            }
        }

        private static IEnumerable<PaypalPayout> GenerateWithdraws(DataContext context)
        {
            var wagerers = context.Wagerers.ToList();

            foreach (var wagerer in wagerers)
            {
                for (var i = 0; i < 10; i++)
                {
                    var randomSeconds = -_rand.Next(720);
                    var randomDays = -_rand.Next(5);
                    int randomAmount = _rand.Next(400, 700);
                    yield return new PaypalPayout
                    {
                        CreatedAt = DateTime.Now.AddDays(randomDays).AddSeconds(randomSeconds + 30),
                        Wagerer = wagerer,
                        BatchId = "seeded-" + Guid.NewGuid().ToString(),
                        DeductedAmount = randomAmount.AddPaypalWithdrawFees(),
                        RequestedAmount = randomAmount,
                    };
                }
            }
        }

        private static IEnumerable<MatchComment> GenerateMatchComments(DataContext context)
        {
            var wagerers = context.Wagerers.ToList();
            var matches = context.Matches.ToList();
            var comments = _comments;

            foreach (var m in matches)
            {
                comments.Shuffle();
                wagerers.Shuffle();
                for (var i = 0; i < 12; i++)
                {
                    var userComment = new MatchComment
                    {
                        Match = m,
                        CreatedAt = DateTime.Now.AddDays(-0.5).AddSeconds(_rand.Next(0, 60)),
                        Wagerer = wagerers[i],
                        Message = string.Format(comments[i], m.TeamA.Name, m.TeamB.Name),
                    };

                    yield return userComment;
                }
            }

        }

        private static IEnumerable<UserPrediction> GenerateUserPredictions(DataContext context)
        {
            var wagerers = context.Wagerers.ToList();
            var predictions = context.Predictions.ToList();

            foreach (var wagerer in wagerers)
            {
                predictions.Shuffle();
                for (var i = 0; i < 24; i++)
                {
                    var amount = _rand.Next(200, 401);
                    var iseven = amount % 2 == 0;
                    var prediction = predictions[i];

                    var userPred = new UserPrediction
                    {
                        Amount = amount,
                        Wagerer = wagerer,
                        Prediction = prediction,
                        PredictedAt = DateTime.Now.AddDays(-_rand.Next(0, 3)).AddHours(-_rand.Next(1, 11)),
                        Team = iseven ? prediction.Match.TeamA : prediction.Match.TeamB
                    };

                    yield return userPred;
                }
            }
        }

        private static ICollection<Match> GenerateMatches(ICollection<Team> teams)
        {
            var result = new List<Match>();

            var dotaTeams = teams.Take(20).ToList();
            var csgoTeams = teams.Skip(20).Take(20).ToList();
            var nbaTeams = teams.Skip(40).Take(30).ToList();

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

            for (var i = 0; i < 5; i++)
            {
                dotaTeams.Shuffle();
                var eventName = "DPC Pro Circuit Season 1";
                var winner = _rand.Next(100) % 2 == 0 ? dotaTeams[0] : dotaTeams[1];
                var days = _rand.Next(1, 6);
                var match = new Match
                {
                    Series = 3,
                    GameId = Game.Dota2,
                    EventName = eventName,
                    TeamA = dotaTeams[0],
                    TeamB = dotaTeams[1],
                    Predictions = Dota2Predictions(-days, winner)
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

            for (var i = 0; i < 5; i++)
            {
                csgoTeams.Shuffle();
                var eventName = "IEM Katowice";
                var winner = _rand.Next(100) % 2 == 0 ? csgoTeams[0] : csgoTeams[1];
                var days = _rand.Next(1, 6);
                var match = new Match
                {
                    Series = 3,
                    GameId = Game.Csgo,
                    EventName = eventName,
                    TeamA = csgoTeams[0],
                    TeamB = csgoTeams[1],
                    Predictions = CSGOPredictions(-days, winner)
                };
                result.Add(match);
            }

            for (var i = 0; i < 5; i++)
            {
                nbaTeams.Shuffle();
                var eventName = "NBA Regular season";
                var winner = _rand.Next(100) % 2 == 0 ? nbaTeams[0] : nbaTeams[1];
                var days = _rand.Next(1, 6);
                var match = new Match
                {
                    Series = 3,
                    GameId = Game.Sports,
                    EventName = eventName,
                    TeamA = nbaTeams[0],
                    TeamB = nbaTeams[1],
                    Predictions = NBAPredictions(-days, winner)
                };
                result.Add(match);
            }


            return result;
        }

        private static ICollection<Prediction> Dota2Predictions(int days, Team winner = null)
        {
            var randomMinutes = -_rand.Next(30);
            var randomHrs = -_rand.Next(3,15);
            var startDate = DateTime.Now.AddDays(days).AddMinutes(randomMinutes);
            DateTime? settledDate = null;
            if (winner != null)
                settledDate = startDate.AddHours(randomHrs);

            var result = new List<Prediction>()
            {
                new Prediction
                {
                    Winner = winner,
                    Sequence = 1,
                    Title = "Series Winner",
                    IsMain = true,
                    Description = "Which team will win the series?",
                    PredictionStatusId = winner != null ? PredictionStatus.Settled : PredictionStatus.Open,
                    StartDate = startDate,
                    SettledDate = settledDate
                },
                new Prediction
                {
                    Winner = winner,
                    Sequence = 2,
                    Title = "Game 1 Winner",
                    Description = "Which team will win game 1 of this series?",
                    PredictionStatusId = winner != null ? PredictionStatus.Settled : PredictionStatus.Open,
                    StartDate = startDate,
                    SettledDate = settledDate
                },
                new Prediction
                {
                    Winner = winner,
                    Sequence = 3,
                    Title = "Game 2 Winner",
                    Description = "Which team will win game 2 of this series?",
                    PredictionStatusId = winner != null ? PredictionStatus.Settled : PredictionStatus.Open,
                    StartDate = startDate.AddHours(1),
                    SettledDate = settledDate
                },
                new Prediction
                {
                    Winner = winner,
                    Sequence = 4,
                    Title = "Game 3 Winner",
                    Description = "Which team will win game 3 of this series?",
                    PredictionStatusId = winner != null ? PredictionStatus.Settled : PredictionStatus.Open,
                    StartDate = startDate.AddHours(2),
                    SettledDate = settledDate
                },
                new Prediction
                {
                    Winner = winner,
                    Sequence = 5,
                    Title = "Game 1 F10K",
                    Description = "Which team is the first to get 10 kills in game 1?",
                    PredictionStatusId = winner != null ? PredictionStatus.Settled : PredictionStatus.Open,
                    StartDate = startDate,
                    SettledDate = settledDate
                },
                new Prediction
                {
                    Winner = winner,
                    Sequence = 6,
                    Title = "Game 2 F10K",
                    Description = "Which team is the first to get 10 kills in game 2?",
                    PredictionStatusId = winner != null ? PredictionStatus.Settled : PredictionStatus.Open,
                    StartDate = startDate.AddHours(1),
                    SettledDate = settledDate

                },
                new Prediction
                {
                    Winner = winner,
                    Sequence = 7,
                    Title = "Game 3 F10K",
                    Description = "Which team is the first to get 10 kills in game 3?",
                    PredictionStatusId = winner != null ? PredictionStatus.Settled : PredictionStatus.Open,
                    StartDate = startDate.AddHours(2),
                    SettledDate = settledDate
                }
            };
            return result;
        }

        private static ICollection<Prediction> CSGOPredictions(int days, Team winner = null)
        {

            var randomMinutes = -_rand.Next(30);
            var randomHrs = -_rand.Next(3, 15);
            var startDate = DateTime.Now.AddDays(days).AddMinutes(randomMinutes);
            DateTime? settledDate = null;
            if (winner != null)
                settledDate = startDate.AddHours(randomHrs);

            var result = new List<Prediction>()
            {
                new Prediction
                {
                    Winner = winner,
                    Sequence = 1,
                    Title = "Series Winner",
                    IsMain = true,
                    Description = "Which team will win the series?",
                    PredictionStatusId = winner != null ? PredictionStatus.Settled : PredictionStatus.Open,
                    StartDate = startDate,
                    SettledDate = settledDate
                },
                  new Prediction
                {
                    Winner = winner,
                    Sequence = 2,
                    Title = "Game 1 Winner",
                    Description = "Which team will win game 1 of this series?",
                    PredictionStatusId = winner != null ? PredictionStatus.Settled : PredictionStatus.Open,
                    StartDate = startDate,
                    SettledDate = settledDate
                },
                new Prediction
                {
                    Winner = winner,
                    Sequence = 3,
                    Title = "Game 2 Winner",
                    Description = "Which team will win game 2 of this series?",
                    PredictionStatusId = winner != null ? PredictionStatus.Settled : PredictionStatus.Open,
                    StartDate = startDate.AddHours(1),
                    SettledDate = settledDate
                },
                new Prediction
                {
                    Winner = winner,
                    Sequence = 4,
                    Title = "Game 3 Winner",
                    Description = "Which team will win game 3 of this series?",
                    PredictionStatusId = winner != null ? PredictionStatus.Settled : PredictionStatus.Open,
                    StartDate = startDate.AddHours(2),
                    SettledDate = settledDate
                },
            };
            return result;
        }

        private static ICollection<Prediction> NBAPredictions(int days, Team winner = null)
        {

            var randomMinutes = -_rand.Next(30);
            var randomHrs = -_rand.Next(3, 15);
            var startDate = DateTime.Now.AddDays(days).AddMinutes(randomMinutes);
            DateTime? settledDate = null;
            if (winner != null)
                settledDate = startDate.AddHours(randomHrs);

            var result = new List<Prediction>()
            {
                new Prediction
                {
                    Winner = winner,
                    Sequence = 1,
                    Title = "Game Winner",
                    IsMain = true,
                    Description = "Which team will win the game?",
                    PredictionStatusId = winner != null ? PredictionStatus.Settled : PredictionStatus.Open,
                    StartDate = startDate,
                    SettledDate = settledDate
                },
                  new Prediction
                {
                    Winner = winner,
                    Sequence = 2,
                    Title = "1st Half Winner",
                    Description = "Which team will win the 1st half of this game?",
                    PredictionStatusId = winner != null ? PredictionStatus.Settled : PredictionStatus.Open,
                    StartDate = startDate,
                    SettledDate = settledDate
                },
            };
            return result;
        }

        private static void SetFinalOdds(DataContext ctx, IPredictionOddsReader oddsReader)
        {
            var settledPrediction = ctx.Predictions
                .Include(x => x.Predictors)
                .Include(x => x.Match)
                .Where(x => x.PredictionStatusId == Domain.PredictionStatus.Settled).ToList();
            foreach (var prediction in settledPrediction)
            {
                var odds = oddsReader.ReadOdds(prediction);
                prediction.WinningOdds = prediction.WinnerId == prediction.Match.TeamAId ? odds.TeamA.Odds : odds.TeamB.Odds;
            }

            ctx.SaveChanges();
        }

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

    }

}
