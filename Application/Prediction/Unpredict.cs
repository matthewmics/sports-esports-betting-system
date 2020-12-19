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
                var prediction = _context.Predictions.SingleOrDefault(x => x.Id == request.PredictionId);
                if (prediction == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Prediction = "Prediction not found" });

                var customer = await _context.Customers.Include(x => x.AppUser)
                              .Where(a => a.AppUser.Email == _userAccessor.GetCurrentEmail())
                              .SingleAsync();

                var userPrediction = await _context.UserPredictions
                    .SingleOrDefaultAsync(x => x.CustomerId == customer.AppUserId &&
                                               x.PredictionId == prediction.Id);

                if (userPrediction == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, 
                        new { Prediction = "You did not participate in this prediction" });

                _context.UserPredictions.Remove(userPrediction);

                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }

    }
}
