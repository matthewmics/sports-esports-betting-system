using Application.Photo;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Wagerers
{
    public class MappingProfile : AutoMapper.Profile
    {
        private readonly IImageHostGenerator _hostGenerator;

        public MappingProfile(IImageHostGenerator hostGenerator)
        {
            _hostGenerator = hostGenerator;
        }

        public MappingProfile()
        {
            CreateMap<Domain.Wagerer, Dtos.WagererDto>()
                .ForMember(x => x.DisplayName, x => x.MapFrom(x => x.AppUser.DisplayName))
                .ForMember(x => x.Id, x => x.MapFrom(x => x.AppUserId))
                .ForMember(x => x.Photo, x => x.MapFrom(x => _hostGenerator.GetHostImage(x.ProfilePhoto)))
                .ForMember(x => x.Email, x => x.MapFrom(x => x.AppUser.Email));
        }
    }
}
