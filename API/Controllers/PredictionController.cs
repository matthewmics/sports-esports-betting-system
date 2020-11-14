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
        private readonly IWalletReader _walletReader;

        public PredictionController(IMapper mapper, IUserAccessor userAccessor, IWalletReader walletReader)
        {
            _mapper = mapper;
            _userAccessor = userAccessor;
            _walletReader = walletReader;
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
                ActivePrediction = activePrediction
            };

            return Ok(predictionDetails);
        }

        [Authorize]
        [HttpPost("{id}/predictions/{predictionId}/predict")]
        public async Task<ActionResult> Predict(int id, int predictionId, [FromBody] PredictionRequestDto request)
        {

            if (request.Amount < 50)
                return BadRequest(new { error = "Minimum amount is 50" });

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

            if (userPrediction != null)
                return BadRequest(new { error = "Already have a prediction" });

            if(_walletReader.ReadWallet(customer) < request.Amount)
                return BadRequest(new { error = "You don't have enough credits" });

            userPrediction = new UserPrediction
            {
                Customer = customer,
                Prediction = prediction,
                Amount = request.Amount,
                Team = team
            };
            Context.UserPredictions.Add(userPrediction);

            var success = await Context.SaveChangesAsync() > 0;

            var activePrediction = _mapper.Map<ActivePredictionDto>(userPrediction);

            if (success)
                return Ok(activePrediction);

            throw new Exception("Problem saving changes");
        }

        [Authorize]
        [HttpPut("{id}/predictions/{predictionId}/predict")]
        public async Task<ActionResult> UpdatePrediction(int id, int predictionId, [FromBody] PredictionRequestDto request)
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
                return NotFound(new { error = "Prediction not found" });

            if (_walletReader.ReadWallet(customer) + userPrediction.Amount < request.Amount)
                return BadRequest(new { error = "You don't have enough credits" });

            userPrediction.Amount = request.Amount;
            userPrediction.Team = team;

            var success = await Context.SaveChangesAsync() > 0;

            var activePrediction = _mapper.Map<ActivePredictionDto>(userPrediction);

            if (success)
                return Ok(activePrediction);

            throw new Exception("Problem saving changes");
        }

        [Authorize]
        [HttpDelete("{id}/predictions/{predictionId}/predict")]
        public async Task<ActionResult> Unpredict(int id, int predictionId)
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
                          .SingleAsync();

            var userPrediction = await Context.UserPredictions
                .SingleOrDefaultAsync(x => x.CustomerId == customer.AppUserId &&
                                           x.PredictionId == prediction.Id);

            if (userPrediction == null)
                return NotFound(new { error = "Prediction not found" });

            Context.UserPredictions.Remove(userPrediction);

            await Context.SaveChangesAsync();

            return NoContent();
        }
    }
}
