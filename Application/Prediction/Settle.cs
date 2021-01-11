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
using Microsoft.AspNetCore.SignalR;
using Application.Hubs;
using Application.Match;
using AutoMapper;
using Application.Prediction.Dtos;

namespace Application.Prediction
{
    public class Settle
    {

        public class Command : IRequest
        {
            public int PredictionId { get; set; }
            public int TeamId { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IPredictionOddsReader _oddsReader;
            private readonly IHubContext<CommonHub> _hubContext;
            private readonly IHubContext<MainHub> _mainHubContext;
            private readonly IMediator _mediator;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IPredictionOddsReader oddsReader, 
                IHubContext<CommonHub> hubContext,
                IHubContext<MainHub> mainHubContext,
                IMediator mediator,
                IMapper mapper)
            {
                _context = context;
                _oddsReader = oddsReader;
                _hubContext = hubContext;
                _mainHubContext = mainHubContext;
                _mediator = mediator;
                _mapper = mapper;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var prediction = await _context.Predictions
                    .Include(x => x.Match)
                        .ThenInclude(x => x.Predictions)
                    .Include(x => x.Match)
                        .ThenInclude(x => x.TeamA)
                    .Include(x => x.Match)
                        .ThenInclude(x => x.TeamB)
                    .Include(x => x.Predictors)
                        .ThenInclude(x => x.Wagerer)
                            .ThenInclude(x => x.AppUser)
                    .SingleOrDefaultAsync(x => x.Id == request.PredictionId);

                if (prediction == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound,
                        new { Prediction = "Prediction not found" });

                var match = prediction.Match;

                if (prediction.PredictionStatusId != Domain.PredictionStatus.Live)
                    throw new RestException(System.Net.HttpStatusCode.NotFound,
                        new { Prediction = "Prediction must be live in order to settle" });

                var winningTeamId = match.TeamAId == request.TeamId ? match.TeamAId :
                                    match.TeamBId == request.TeamId ? match.TeamBId : -1;

                if (winningTeamId == -1)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest,
                        new { Team = "Selected team is not participating the prediction" });

                if (prediction.IsMain)
                {
                    foreach (var p in prediction.Match.Predictions)
                    {
                        if (p.PredictionStatusId != Domain.PredictionStatus.Settled)
                        {
                            p.PredictionStatusId = Domain.PredictionStatus.Cancelled;
                            p.SettledDate = DateTime.Now;
                        }
                    }
                }

                prediction.PredictionStatusId = Domain.PredictionStatus.Settled;
                prediction.SettledDate = DateTime.Now;
                prediction.WinnerId = winningTeamId;

                var odds = _oddsReader.ReadOdds(prediction);

                prediction.WinningOdds = winningTeamId == prediction.Match.TeamAId ? odds.TeamA.Odds : odds.TeamB.Odds;

                foreach (var predictor in prediction.Predictors)
                {
                    var notif = new Domain.PredictionNotification
                    {
                        CreatedAt = DateTime.Now,
                        WagererId = predictor.WagererId,
                        Prediction = prediction,
                    };

                    if (predictor.TeamId == prediction.WinnerId)
                        notif.Outcome = predictor.Amount * prediction.WinningOdds;
                    else
                        notif.Outcome = -predictor.Amount;

                    var tosend = _mapper.Map<PredictionNotificationDto>(notif);
                    await _mainHubContext.Clients.User(predictor.Wagerer.AppUser.Email).SendAsync("ReceivePredictionOutome", tosend);

                    _context.PredictionNotification.Add(notif);

                }

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
