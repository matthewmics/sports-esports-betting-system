using Domain;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Application.User.Dtos;
using Application.Interfaces;
using System;

namespace Application.User
{
    public class TokenResolver<T> : IValueResolver<T, BaseUser, string>
    {
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IConfiguration _configuration;

        public TokenResolver(IJwtTokenGenerator jwtTokenGenerator, IConfiguration configuration)
        {
            _jwtTokenGenerator = jwtTokenGenerator;
            _configuration = configuration;
        }

        public string Resolve(T source, BaseUser destination, string destMember, ResolutionContext context)
        {
            if(source is AppUser)
            {
                AppUser user = source as AppUser;
                return _jwtTokenGenerator.GenerateToken(user.Email,
                        _configuration.GetSection("AppSettings:TokenKey").Value);
            }

            if (source is Wagerer)
            {
                Wagerer user = source as Wagerer;
                return _jwtTokenGenerator.GenerateToken(user.AppUser.Email,
                        _configuration.GetSection("AppSettings:TokenKey").Value);
            }

            throw new Exception("Problem generating token");
        }
    }
}
