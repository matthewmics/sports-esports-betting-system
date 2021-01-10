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
using AutoMapper;
using Application.Prediction.Dtos;
using System.Linq;
using Application.Validators;
using Microsoft.AspNetCore.SignalR;
using Application.Hubs;
using Application.Match;

namespace Application.Prediction
{
    public class Create
    {

        public class Command : IRequest
        {
            public int MatchId { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public DateTime StartsAt { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Title).NotEmpty()
                    .MaximumLength(50);
                RuleFor(x => x.Description)
                    .MaximumLength(75)
                    .NotEmpty();
                RuleFor(x => x.StartsAt).NotEmpty()
                    .FutureDate().WithMessage("'StartsAt' must be a future date");
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
                var match = await _context.Matches.Include(x => x.Predictions).SingleOrDefaultAsync(x => x.Id == request.MatchId);
                if (match == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Match = "Match not found" });

                var prediction = new Domain.Prediction
                {
                    Title = request.Title,
                    Description = request.Description,
                    StartDate = request.StartsAt,
                    IsMain = false,
                    Sequence = (match.Predictions.Max(x => x.Sequence)) + 1,
                    PredictionStatus = await _context.PredictionStatuses.FindAsync(Domain.PredictionStatus.Open)
                };

                match.Predictions.Add(prediction);

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
