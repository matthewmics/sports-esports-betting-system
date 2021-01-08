using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using AutoMapper;
using Application.Match.Dtos;

namespace Application.Match
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<Domain.Match, MatchDto>()
                .ForMember(x => x.StartDate, x =>
                x.MapFrom(y => y.Predictions.Single(x => x.IsMain).StartDate))
                .ForMember(x => x.SettledDate, x => x.MapFrom(x => x.Predictions.Single(x => x.IsMain).SettledDate))
                .ForMember(x => x.MatchStatus, x => x.MapFrom(x => x.Predictions.Single(x => x.IsMain).PredictionStatus))
                .ForMember(x => x.Winner, x => x.MapFrom(x => x.Predictions.Single(x => x.IsMain).Winner));


            CreateMap<Domain.Match, MatchRecentDto>()
                .ForMember(x => x.Winner, x => x.MapFrom(x => x.Predictions.Single(x => x.IsMain).Winner))
                .ForMember(x => x.SettledDate, x => x.MapFrom(x => x.Predictions.Single(x => x.IsMain).SettledDate));
        }
    }
}
