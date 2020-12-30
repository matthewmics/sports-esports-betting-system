using Application.Errors;
using Application.Interfaces;
using Application.Prediction.Dtos;
using Application.User;
using AutoMapper;
using Domain;
using FluentValidation;
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
    public class Predict
    {
        public class Command : IRequest<ActivePredictionDto>
        {
            public int PredictionId { get; set; }
            public int Amount { get; set; }
            public int TeamId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Amount)
                    .NotEmpty()
                    .GreaterThan(49).WithMessage("Minimum amount is 50")
                    .LessThan(100001).WithMessage("Maximum amount is 100,000");
                RuleFor(x => x.TeamId).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, ActivePredictionDto>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IWalletReader _walletReader;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IUserAccessor userAccessor, IWalletReader walletReader,
                IMapper mapper)
            {
                _context = context;
                _userAccessor = userAccessor;
                _walletReader = walletReader;
                _mapper = mapper;
            }

            public async Task<ActivePredictionDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var prediction = await _context.Predictions
                    .Include(x => x.Match)
                    .SingleOrDefaultAsync(x => x.Id == request.PredictionId);

                if (prediction == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Prediction = "Prediction not found" });

                if (prediction.PredictionStatusId == Domain.PredictionStatus.Live)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest,
                        new { Prediction = "Prediction is already live" });

                if (prediction.PredictionStatusId == Domain.PredictionStatus.Settled ||
                    prediction.PredictionStatusId == Domain.PredictionStatus.Cancelled)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest,
                        new { Prediction = "Prediction is already finished" });

                if (request.TeamId != prediction.Match.TeamAId && request.TeamId != prediction.Match.TeamBId)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest,
                        new { Team = "Team chosen is not available for this prediction" });

                var predictedTeamId = prediction.Match.TeamAId == request.TeamId ? prediction.Match.TeamAId : prediction.Match.TeamBId;
                var team = await _context.Teams.FindAsync(predictedTeamId);

                var wagerer = await _context.Wagerers.Include(x => x.AppUser)
                              .SingleAsync(a => a.AppUser.Email == _userAccessor.GetCurrentEmail());

                var userPrediction = await _context.UserPredictions
                    .SingleOrDefaultAsync(x => x.WagererId == wagerer.AppUserId &&
                                               x.PredictionId == prediction.Id);

                if (userPrediction != null)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { Prediction = "Already have prediction" });

                if (_walletReader.ReadWallet(wagerer) < request.Amount)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { Amount = "Not enough credits" });

                userPrediction = new UserPrediction
                {
                    Wagerer = wagerer,
                    Prediction = prediction,
                    Amount = request.Amount,
                    Team = team,
                    PredictedAt = DateTime.Now,
                };
                _context.UserPredictions.Add(userPrediction);

                var success = await _context.SaveChangesAsync() > 0;

                var activePrediction = _mapper.Map<ActivePredictionDto>(userPrediction);

                if (success)
                    return activePrediction;

                throw new Exception("Problem saving changes");
            }
        }
    }
}
