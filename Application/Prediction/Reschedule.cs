using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using Application.Validators;

namespace Application.Prediction
{
    public class Reschedule
    {

        public class Command : IRequest
        {
            public int PredictionId { get; set; }
            public DateTime Schedule { get; set; }
        }


        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {

                RuleFor(x => x.Schedule).NotEmpty()
                    .FutureDate().WithMessage("'Schedule' must be a future date");
            }
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

                if (prediction.PredictionStatusId == Domain.PredictionStatus.Cancelled ||
                    prediction.PredictionStatusId == Domain.PredictionStatus.Settled)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, 
                        new { Prediction = "Cannot reschedule a settled or cancelled prediction" });

                prediction.PredictionStatusId = Domain.PredictionStatus.Open;
                prediction.StartDate = request.Schedule;

                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }

    }
}
