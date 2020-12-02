using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Prediction
{
    public class Unpredict
    {

        public class Command : IRequest
        {
            public int MatchId { get; set; }
            public int PredictionId { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this._context = context;
                this._userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {

                var match = await _context.Matches.Include(x => x.Predictions)
                                  .SingleOrDefaultAsync(m => m.Id == request.MatchId);

                if (match == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Match = "Match not found" });

                var prediction = match.Predictions.SingleOrDefault(x => x.Id == request.PredictionId);
                if (prediction == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Prediction = "Prediction not found" });

                var customer = await _context.Customers.Include(x => x.AppUser)
                              .Where(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername())
                              .SingleAsync();

                var userPrediction = await _context.UserPredictions
                    .SingleOrDefaultAsync(x => x.CustomerId == customer.AppUserId &&
                                               x.PredictionId == prediction.Id);

                if (userPrediction == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Prediction = "You did not participate in this prediction" });

                _context.UserPredictions.Remove(userPrediction);

                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }

    }
}
