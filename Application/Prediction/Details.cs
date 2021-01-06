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
            public int PredictionId { get; set; }
        }

        public class Handler : IRequestHandler<Query, PredictionDetailsDto>
        {
            private readonly DataContext _ctx;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            private readonly IPredictionOddsReader _oddsReader;

            public Handler(DataContext ctx, IMapper mapper, IUserAccessor userAccessor, IPredictionOddsReader oddsReader)
            {
                _ctx = ctx;
                _mapper = mapper;
                _userAccessor = userAccessor;
                _oddsReader = oddsReader;
            }

            public async System.Threading.Tasks.Task<PredictionDetailsDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var prediction = await _ctx.Predictions
                    .Include(x => x.Predictors)
                    .Include(x => x.Match)
                    .Include(x => x.PredictionStatus)
                    .Include(x => x.Winner)
                    .SingleOrDefaultAsync(x => x.Id == request.PredictionId);
                if (prediction == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Prediction = "Prediction not found" });

                var wagerer = await _ctx.Wagerers.Include(x => x.AppUser)
                              .Where(a => a.AppUser.Email == _userAccessor.GetCurrentEmail())
                              .SingleOrDefaultAsync();

                ActivePredictionDto activePrediction = null;

                if (wagerer != null)
                {
                    var userPrediction = await _ctx.UserPredictions.Include(x => x.Team).SingleOrDefaultAsync(x =>
                         x.WagererId == wagerer.AppUserId && x.PredictionId == prediction.Id);

                    if (userPrediction != null)
                        activePrediction = _mapper.Map<ActivePredictionDto>(userPrediction);
                }

                var predictionDetails = new PredictionDetailsDto
                {
                    ActivePrediction = activePrediction,
                    Prediction = _mapper.Map<PredictionDto>(prediction),
                    TeamPredictionEnvelope = _oddsReader.ReadOdds(prediction)
                };

                return predictionDetails;
            }
        }

    }
}


