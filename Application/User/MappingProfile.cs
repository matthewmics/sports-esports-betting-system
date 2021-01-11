using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using AutoMapper;
using Application.User.Dtos;
using Application.Wagerers;

namespace Application.User
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<Wagerer, UserDto>()
                .ForMember(x => x.Token, x => x.MapFrom<TokenResolver<Wagerer>>())
                .ForMember(x => x.WalletBalance, x => x.MapFrom<WalletResolver>())
                .ForMember(x => x.Photo, x => x.MapFrom<PhotoResolver>())
                .ForMember(x => x.DisplayName, x => x.MapFrom(x => x.AppUser.DisplayName))
                .ForMember(x => x.Email, x => x.MapFrom(x => x.AppUser.Email));                

            CreateMap<AppUser, AdminDto>()
                .ForMember(x => x.Token, x => x.MapFrom<TokenResolver<AppUser>>());

            CreateMap<PredictionNotification, PredictionNotificationDto>()
                .ForMember(x => x.When, x => x.MapFrom(x => x.CreatedAt))
                .ForMember(x => x.MatchId, x => x.MapFrom(x => x.Prediction.MatchId))
                .ForMember(x => x.MatchPredictionName, x => 
                x.MapFrom(x => $"{x.Prediction.Match.TeamA.Name} vs {x.Prediction.Match.TeamB.Name} | {x.Prediction.Title}"));
        }
    }
}
