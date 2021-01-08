using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Application.Prediction
{
    public class Cancel
    {

        public class Command : IRequest
        {
            public int PredictionId { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var prediction = await _context.Predictions.Include(x => x.Match).ThenInclude(x => x.Predictions)
                    .SingleOrDefaultAsync(x => x.Id == request.PredictionId);

                if (prediction == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, 
                        new { Prediction = "Prediction not found" });
                if (prediction.PredictionStatusId == Domain.PredictionStatus.Settled)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, 
                        new { Prediction = "Cannot cancel a settled prediction" });


                if (prediction.IsMain)
                {
                    foreach(var p in prediction.Match.Predictions)
                    {
                        if(p.PredictionStatusId != Domain.PredictionStatus.Settled)
                        {
                            p.PredictionStatusId = Domain.PredictionStatus.Cancelled;
                            p.SettledDate = DateTime.Now;
                        }
                    }
                }
                    
                prediction.PredictionStatusId = Domain.PredictionStatus.Cancelled;
                prediction.SettledDate = DateTime.Now;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }

    }
}
