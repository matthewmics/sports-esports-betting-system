using Application.Interfaces;
using Domain;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Application.User.Dtos;

namespace Application.User
{
    public class TokenResolver : IValueResolver<AppUser, BaseUser, string>
    {
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IConfiguration _configuration;

        public TokenResolver(IJwtTokenGenerator jwtTokenGenerator, IConfiguration configuration)
        {
            _jwtTokenGenerator = jwtTokenGenerator;
            _configuration = configuration;
        }

        public string Resolve(AppUser source, BaseUser destination, string destMember, ResolutionContext context)
        {
            return _jwtTokenGenerator.GenerateToken(source.Email,
                    _configuration.GetSection("AppSettings:TokenKey").Value);
        }
    }
}
