using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using AutoMapper;
using Application.Prediction.Dtos;

namespace Application.Prediction
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<Domain.Prediction, PredictionDto>();

            CreateMap<UserPrediction, ActivePredictionDto>()
                .ForMember(x => x.PotentialReward, x => x.MapFrom<PotentialRewardResolver>())
                .ForMember(x => x.Outcome, x => x.MapFrom<OutcomeResolver<ActivePredictionDto>>());


            CreateMap<PredictionNotification, PredictionNotificationDto>()
                .ForMember(x => x.When, x => x.MapFrom(x => x.CreatedAt))
                .ForMember(x => x.MatchId, x => x.MapFrom(x => x.Prediction.MatchId))
                .ForMember(x => x.MatchPredictionName, x =>
                x.MapFrom(x => $"{x.Prediction.Match.TeamA.Name} vs {x.Prediction.Match.TeamB.Name} | {x.Prediction.Title}"));
        }
    }
}
