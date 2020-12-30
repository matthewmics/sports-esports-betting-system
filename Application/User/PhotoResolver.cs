using System;
using System.Collections.Generic;
using System.Text;
using Application.Photo;
using Application.User.Dtos;
using AutoMapper;
using Domain;

namespace Application.User
{
    public class PhotoResolver : IValueResolver<Domain.Wagerer, UserDto, string>
    {
        private readonly IImageHostGenerator _imageHostGenerator;

        public PhotoResolver(IImageHostGenerator imageHostGenerator)
        {
            _imageHostGenerator = imageHostGenerator;
        }

        public string Resolve(Wagerer source, UserDto destination, string destMember, ResolutionContext context)
        {
            if (source.ProfilePhoto == null)
                return null;

            return _imageHostGenerator.GetHostImage(source.ProfilePhoto);
        }
    }
}
