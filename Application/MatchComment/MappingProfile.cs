using System;
using System.Collections.Generic;
using System.Text;

namespace Application.MatchComment
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<Domain.MatchComment, Dtos.MatchCommentDto>()
                .ForMember(x => x.DisplayName, x => x.MapFrom(x => x.Wagerer.ProfilePhoto))
                .ForMember(x => x.DisplayName, x => x.MapFrom(x => x.Wagerer.AppUser.DisplayName));
        }
    }
}
