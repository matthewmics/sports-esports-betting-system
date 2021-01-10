using Application.Errors;
using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using Application.Hubs;
using Application.Match;

namespace Application.Prediction
{
    public class SetLive
    {
        public class Command : IRequest
        {
            public int PredictionId { get; set; }
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
                var prediction = await _context.Predictions.Include(x => x.Match).ThenInclude(x => x.Predictions)
                    .SingleOrDefaultAsync(x => x.Id == request.PredictionId);

                if (prediction == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Prediction = "Prediction not found" });
                if (prediction.PredictionStatusId == Domain.PredictionStatus.Live)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { Prediction = "Prediction is already live" });

                if (!prediction.IsMain)
                {
                    var mainPrediction = prediction.Match.Predictions.Single(x => x.IsMain);
                    if (!(mainPrediction.PredictionStatusId == Domain.PredictionStatus.Live))
                    {
                        throw new RestException(System.Net.HttpStatusCode.BadRequest,
                            new { Prediction = "Main prediction must be live before other predictions can go live" });
                    }
                }

                prediction.PredictionStatusId = Domain.PredictionStatus.Live;
                prediction.StartDate = DateTime.Now;

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
