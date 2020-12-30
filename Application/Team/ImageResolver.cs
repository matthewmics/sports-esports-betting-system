using System;
using System.Collections.Generic;
using System.Text;
using Application.Photo;
using Application.Team.Dtos;
using AutoMapper;

namespace Application.Team
{
    public class ImageResolver : IValueResolver<Domain.Team, TeamDto, string>
    {
        private readonly IImageHostGenerator _imageHostGenerator;

        public ImageResolver(IImageHostGenerator imageHostGenerator)
        {
            _imageHostGenerator = imageHostGenerator;
        }

        public string Resolve(Domain.Team source, TeamDto destination, string destMember, ResolutionContext context)
        {
            if (source.Image == null)
                return null;
            return _imageHostGenerator.GetHostImage(source.Image);
        }
    }
}
