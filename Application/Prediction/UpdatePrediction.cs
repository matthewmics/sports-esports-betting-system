using Application.Errors;
using Application.Interfaces;
using Application.Prediction.Dtos;
using AutoMapper;
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
    public class UpdatePrediction
    {

        public class Command : IRequest<ActivePredictionDto>
        {
            public int MatchId { get; set; }
            public int PredictionId { get; set; }
            public int Amount { get; set; }
            public int TeamId { get; set; }
        }

        public class Handler : IRequestHandler<Command, ActivePredictionDto>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IWalletReader _walletReader;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IUserAccessor userAccessor, IWalletReader walletReader, IMapper mapper)
            {
                _context = context;
                _userAccessor = userAccessor;
                _walletReader = walletReader;
                _mapper = mapper;
            }

            public async Task<ActivePredictionDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var match = await _context.Matches.Include(x => x.Predictions)
                              .SingleOrDefaultAsync(m => m.Id == request.MatchId);

                if (match == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Match = "Match not found" });

                if (request.TeamId != match.TeamAId && request.TeamId != match.TeamBId)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Team = "Team not found for this match" });

                var predictedTeamId = match.TeamAId == request.TeamId ? match.TeamAId : match.TeamBId;
                var team = await _context.Teams.FindAsync(predictedTeamId);

                var prediction = match.Predictions.SingleOrDefault(x => x.Id == request.PredictionId);
                if (prediction == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Prediction = "Prediction not found" });

                var customer = await _context.Customers.Include(x => x.AppUser)
                              .Where(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername())
                              .SingleAsync();

                var userPrediction = await _context.UserPredictions
                    .SingleOrDefaultAsync(x => x.CustomerId == customer.AppUserId &&
                                               x.PredictionId == prediction.Id);

                if (userPrediction == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Prediction = "You did not participate in this prediction" });

                if (_walletReader.ReadWallet(customer) + userPrediction.Amount < request.Amount)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { Amount = "Not enough credits" });

                userPrediction.Amount = request.Amount;
                userPrediction.Team = team;

                var success = await _context.SaveChangesAsync() > 0;

                var activePrediction = _mapper.Map<ActivePredictionDto>(userPrediction);

                if (success)
                    return activePrediction;

                throw new Exception("Problem saving changes");
            }

        }

    }
}
