using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using AutoMapper;
using Application.Team.Dtos;

namespace Application.Team
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<Domain.Team, TeamDto>()
                .ForMember(x => x.Image, x => x.MapFrom<ImageResolver>());
        }
    }
}
