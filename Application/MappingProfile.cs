﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using AutoMapper;

namespace API.Configs
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //CreateMap<Team, TeamDto>();

            //CreateMap<AppUser, UserDto>()
            //    .ForMember(x => x.Username, x => x.MapFrom(x => x.UserName))
            //    .ForMember(x => x.Token, x => x.MapFrom<TokenResolver>())
            //    .ForMember(x => x.WalletBalance, x => x.MapFrom<WalletResolver>());

            //CreateMap<AppUser, AdminDto>()
            //    .ForMember(x => x.Username, x => x.MapFrom(x => x.UserName))
            //    .ForMember(x => x.Token, x => x.MapFrom<TokenResolver>());

            //CreateMap<Prediction, PredictionDto>();

            //CreateMap<UserPrediction, ActivePredictionDto>();

        }
    }
}