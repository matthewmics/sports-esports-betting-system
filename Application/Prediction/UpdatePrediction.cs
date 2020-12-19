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
                if (request.Amount < 50)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { Amount = "Minimum amount is 50" });

                var prediction = _context.Predictions.Include(x => x.Match).SingleOrDefault(x => x.Id == request.PredictionId);
                if (prediction == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Prediction = "Prediction not found" });

                if (request.TeamId != prediction.Match.TeamAId && request.TeamId != prediction.Match.TeamBId)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Team = "Team not found for this match" });

                var predictedTeamId = prediction.Match.TeamAId == request.TeamId ? prediction.Match.TeamAId : prediction.Match.TeamBId;
                var team = await _context.Teams.FindAsync(predictedTeamId);

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
