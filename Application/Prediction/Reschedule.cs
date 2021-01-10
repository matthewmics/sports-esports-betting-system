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
using Microsoft.AspNetCore.SignalR;
using Application.Hubs;
using Application.Match;

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
            private readonly IHubContext<CommonHub> _hubContext;
            private readonly IMediator _mediator;

            public Handler(DataContext context, IHubContext<CommonHub> hubContext, IMediator mediator)
            {
                _context = context;
                _hubContext = hubContext;
                _mediator = mediator;
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

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                {
                    var matchDto = await _mediator.Send(new Get.Query { Id = prediction.MatchId });
                    await _hubContext.Clients.All.SendAsync("PredictionUpdate", matchDto);
                    return Unit.Value;
                }

                throw new Exception("Problem saving changes");
            }
        }

    }
}
