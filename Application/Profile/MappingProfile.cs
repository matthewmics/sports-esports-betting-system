using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Profile
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<Domain.Team, Dtos.UserPredictionTeamDto>();
            CreateMap<Domain.UserPrediction, Dtos.UserPredictionDto>()
                .ForMember(x => x.PredictionTitle, x => x.MapFrom(x => x.Prediction.Title))
                .ForMember(x => x.Game, x => x.MapFrom(x => x.Prediction.Match.Game))
                .ForMember(x => x.PredictionId, x => x.MapFrom(x => x.Prediction.Id))
                .ForMember(x => x.MatchId, x => x.MapFrom(x => x.Prediction.Match.Id))
                .ForMember(x => x.TeamA, x => x.MapFrom<UserPredictionTeamAResolver>())
                .ForMember(x => x.TeamB, x => x.MapFrom<UserPredictionTeamBResolver>());
        }
    }
}
