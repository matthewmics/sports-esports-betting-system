using API.Dtos;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Configs
{
    public class TokenResolver : IValueResolver<AppUser, UserDto, string>
    {
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IConfiguration _configuration;

        public TokenResolver(IJwtTokenGenerator jwtTokenGenerator, IConfiguration configuration)
        {
            _jwtTokenGenerator = jwtTokenGenerator;
            _configuration = configuration;
        }

        public string Resolve(AppUser source, UserDto destination, string destMember, ResolutionContext context)
        {
            return _jwtTokenGenerator.GenerateToken(source.UserName,
                    _configuration.GetSection("AppSettings:TokenKey").Value);
        }
    }
}
