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
    public class Details
    {

        public class Query : IRequest<PredictionDetailsDto>
        {
            public int MatchId { get; set; }
            public int PredictionId { get; set; }

        }

        public class Handler : IRequestHandler<Query, PredictionDetailsDto>
        {
            private readonly DataContext _ctx;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext ctx, IMapper mapper, IUserAccessor userAccessor)
            {
                _ctx = ctx;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async System.Threading.Tasks.Task<PredictionDetailsDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var match = await _ctx.Matches.Include(x => x.Predictions)
                              .SingleOrDefaultAsync(m => m.Id == request.MatchId);

                if (match == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Match = "Match not found" });

                var prediction = match.Predictions.SingleOrDefault(x => x.Id == request.PredictionId);
                if (prediction == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Prediction = "Prediction not found" });

                var customer = await _ctx.Customers.Include(x => x.AppUser)
                              .Where(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername())
                              .SingleOrDefaultAsync();

                ActivePredictionDto activePrediction = null;

                if (customer != null)
                {
                    var userPrediction = await _ctx.UserPredictions.Include(x => x.Team).SingleOrDefaultAsync(x =>
                         x.CustomerId == customer.AppUserId && x.PredictionId == prediction.Id);

                    if (userPrediction != null)
                        activePrediction = _mapper.Map<ActivePredictionDto>(userPrediction);
                }


                var predictionDetails = new PredictionDetailsDto
                {
                    ActivePrediction = activePrediction
                };

                return predictionDetails;
            }
        }

    }
}


