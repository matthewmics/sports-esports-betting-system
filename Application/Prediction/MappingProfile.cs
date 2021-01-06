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
                .ForMember(x => x.PotentialReward, x => x.MapFrom<PotentialRewardResolver>());
        }
    }
}
