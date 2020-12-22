using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
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
                var prediction = await _context.Predictions.FindAsync(request.PredictionId);
                if (prediction == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Prediction = "Prediction not found" });
                if (prediction.PredictionStatusId == Domain.PredictionStatus.Settled)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Prediction = "Cannot cancel a settled prediction" });

                prediction.PredictionStatusId = Domain.PredictionStatus.Cancelled;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }

    }
}
