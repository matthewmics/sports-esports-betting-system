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
    public class Reschedule
    {

        public class Command : IRequest
        {
            public int PredictionId { get; set; }
            public DateTime Schedule { get; set; }
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
                var prediction = await _context.Predictions.Include(x => x.PredictionStatus).SingleOrDefaultAsync(x => x.Id == request.PredictionId);
                if (prediction == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Prediction = "Prediction not found" });

                if(prediction.PredictionStatus.Id != Domain.PredictionStatus.Open)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { Prediction = "Prediction must be open to reschedule" });

                if (request.Schedule < DateTime.Now)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { Schedule = "Schedule must be a future date" });

                prediction.StartDate = request.Schedule;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }

    }
}
