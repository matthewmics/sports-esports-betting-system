using Application.Errors;
using Application.Match.Dtos;
using Application.Validators;
using AutoMapper;
using FluentValidation;
using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Match
{
    public class Create
    {

        public class Command : IRequest<MatchDto>
        {
            // Match
            public string EventName { get; set; }
            public int TeamAId { get; set; }
            public int TeamBId { get; set; }
            public int GameId { get; set; }
            public int Series { get; set; }

            // Main Prediction
            public string Title { get; set; }
            public string Description { get; set; }
            public DateTime StartsAt { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.EventName)
                    .NotEmpty()
                    .MaximumLength(100);
                RuleFor(x => x.TeamAId).NotEmpty();
                RuleFor(x => x.TeamBId).NotEmpty();
                RuleFor(x => x.Series).NotEmpty();

                RuleFor(x => x.Title).NotEmpty()
                    .MaximumLength(50);
                RuleFor(x => x.Description)
                    .MaximumLength(75)
                    .NotEmpty();
                RuleFor(x => x.StartsAt).NotEmpty()
                    .FutureDate().WithMessage("'StartsAt' must be a future date");
            }
        }

        public class Handler : IRequestHandler<Command, MatchDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<MatchDto> Handle(Command request, CancellationToken cancellationToken)
            {
                if (request.TeamAId == request.TeamBId)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { Teams = "Teams must not be the same" });

                var match = new Domain.Match
                {
                    EventName = request.EventName,
                    TeamA = await _context.Teams.FindAsync(request.TeamAId),
                    TeamB = await _context.Teams.FindAsync(request.TeamBId),
                    Game = await _context.Games.FindAsync((short)request.GameId),
                    Series = request.Series,
                };

                var prediction = new Domain.Prediction
                {
                    Title = request.Title,
                    Description = request.Description,
                    StartDate = request.StartsAt,
                    IsMain = true,
                    Sequence = 0,
                    PredictionStatus = await _context.PredictionStatuses.FindAsync(Domain.PredictionStatus.Open)
                };

                match.Predictions = new List<Domain.Prediction>
                {
                    prediction
                };

                _context.Matches.Add(match);

                await _context.SaveChangesAsync();

                return _mapper.Map<MatchDto>(match);
            }
        }

    }
}
