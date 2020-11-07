using API.Dtos;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using API.Models;

namespace API.Controllers
{
    [Route("api/matches")]
    public class PredictionController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;

        public PredictionController(IMapper mapper, IUserAccessor userAccessor)
        {
            _mapper = mapper;
            _userAccessor = userAccessor;
        }

        [HttpGet("{id}/predictions/{predictionId}/details")]
        public async Task<ActionResult> PredictionDetails(int id, int predictionId)
        {
            var match = await Context.Matches.Include(x => x.Predictions)
                              .SingleOrDefaultAsync(m => m.Id == id);

            if (match == null)
                return NotFound(new { error = "Match not found" });

            var prediction = match.Predictions.SingleOrDefault(x => x.Id == predictionId);
            if (prediction == null)
                return NotFound(new { error = "Prediction not found" });

            var customer = await Context.Customers.Include(x => x.AppUser)
                          .Where(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername())
                          .SingleOrDefaultAsync();

            ActivePredictionDto activePrediction = null;

            if (customer != null)
            {
                var userPrediction = await Context.UserPredictions.Include(x => x.Team).SingleOrDefaultAsync(x =>
                     x.CustomerId == customer.AppUserId && x.PredictionId == prediction.Id);

                if (userPrediction != null)
                    activePrediction = _mapper.Map<ActivePredictionDto>(userPrediction);
            }

            var predictionDetails = new PredictionDetailsDto
            {
                PotentialReward = 0,
                ActivePrediction = activePrediction
            };

            return Ok(predictionDetails);
        }

        [Authorize]
        [HttpPost("{id}/predictions/{predictionId}/predict")]
        public async Task<ActionResult> Predict(int id, int predictionId, [FromBody] PredictionRequestDto request)
        {
            var match = await Context.Matches.Include(x => x.Predictions)
                              .SingleOrDefaultAsync(m => m.Id == id);

            if (match == null)
                return NotFound(new { error = "Match not found" });

            if (request.TeamId != match.TeamAId && request.TeamId != match.TeamBId)
                return NotFound(new { error = "Team not found for this match" });

            var predictedTeamId = match.TeamAId == request.TeamId ? match.TeamAId : match.TeamBId;
            var team = await Context.Teams.FindAsync(predictedTeamId);

            var prediction = match.Predictions.SingleOrDefault(x => x.Id == predictionId);
            if (prediction == null)
                return NotFound(new { error = "Prediction not found" });

            var customer = await Context.Customers.Include(x => x.AppUser)
                          .Where(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername())
                          .SingleAsync();

            var userPrediction = await Context.UserPredictions
                .SingleOrDefaultAsync(x => x.CustomerId == customer.AppUserId &&
                                           x.PredictionId == prediction.Id);

            if (userPrediction == null)
            {
                userPrediction = new UserPrediction
                {
                    Customer = customer,
                    Prediction = prediction,
                    Amount = request.Amount,
                    Team = team
                };
                Context.UserPredictions.Add(userPrediction);
            }
            else
            {
                // logic for updating prediction
            }

            var success = await Context.SaveChangesAsync() > 0;

            var activePrediction = _mapper.Map<ActivePredictionDto>(userPrediction);

            if (success)
                return Ok(activePrediction);

            throw new Exception("Problem saving changes");
        }
    }
}
