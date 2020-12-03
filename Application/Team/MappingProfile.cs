using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using AutoMapper;

namespace Application.Team
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Domain.Team, TeamDto>()
                .ForMember(x => x.Image, x => x.MapFrom<ImageResolver>());
        }
    }
}
