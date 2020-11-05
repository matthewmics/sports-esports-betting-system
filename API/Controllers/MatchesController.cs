using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using API.Dtos;
using Microsoft.AspNetCore.Authorization;
using API.Interfaces;
using API.Models;

namespace API.Controllers
{
    public class MatchesController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;

        public MatchesController(IMapper mapper, IUserAccessor userAccessor)
        {
            _mapper = mapper;
            _userAccessor = userAccessor;
        }

        public async Task<ActionResult> List()
        {
            var matches = await Context.Matches
                .Include(x => x.TeamA)
                .Include(x => x.TeamB)
                .Include(x => x.Predictions)
                    .ThenInclude(x => x.PredictionStatus)
                .ToListAsync();

            var matchesToReturn = _mapper.Map<ICollection<MatchDto>>(matches);

            return Ok(matchesToReturn);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var match = await Context.Matches
                .Include(x => x.TeamA)
                .Include(x => x.TeamB)
                .Include(x => x.Predictions)
                    .ThenInclude(x => x.PredictionStatus)
                .SingleOrDefaultAsync(x => x.Id == id);

            var matchToReturn = _mapper.Map<MatchDto>(match);

            return Ok(matchToReturn);
        }

        [Authorize]
        [HttpPost("{id}/predictions/{predictionId}/predict")]
        public async Task<ActionResult> Predict(int id, int predictionId, [FromBody] PredictionRequestDto request)
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
            {
                userPrediction = new UserPrediction
                {
                    Customer = customer,
                    Prediction = prediction,
                    Amount = request.Amount,
                };
                Context.UserPredictions.Add(userPrediction);
            }
            else
            {
                // logic for updating prediction
            }

            var success = await Context.SaveChangesAsync() > 0;

            if (success)
                return Ok(new { message = "Success" }); // show message only for now

            throw new Exception("Problem saving changes");
        }

    }
}
