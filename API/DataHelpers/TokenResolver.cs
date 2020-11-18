using API.Dtos;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DataHelpers
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
            return _jwtTokenGenerator.GenerateToken(source.UserName,
                    _configuration.GetSection("AppSettings:TokenKey").Value);
        }
    }
}
