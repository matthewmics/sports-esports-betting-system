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

            public Handler(DataContext ctx, IMapper mapper, IUserAccessor userAccessor)
            {
                _ctx = ctx;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async System.Threading.Tasks.Task<PredictionDetailsDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var prediction = await _ctx.Predictions
                    .Include(x => x.PredictionStatus)
                    .Include(x => x.Winner)
                    .SingleOrDefaultAsync(x => x.Id == request.PredictionId);
                if (prediction == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Prediction = "Prediction not found" });

                var customer = await _ctx.Customers.Include(x => x.AppUser)
                              .Where(a => a.AppUser.Email == _userAccessor.GetCurrentEmail())
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
                    ActivePrediction = activePrediction,
                    Prediction = _mapper.Map<PredictionDto>(prediction)
                };

                return predictionDetails;
            }
        }

    }
}


