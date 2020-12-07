using System;
using System.Collections.Generic;
using System.Text;
using Application.Team.Dtos;
using AutoMapper;
using Microsoft.AspNetCore.Http;

namespace Application.Team
{
    public class ImageResolver : IValueResolver<Domain.Team, TeamDto, string>
    {
        private readonly IHttpContextAccessor _httpAccessor;

        public ImageResolver(IHttpContextAccessor httpContext)
        {
            _httpAccessor = httpContext;
        }

        public string Resolve(Domain.Team source, TeamDto destination, string destMember, ResolutionContext context)
        {
            if (source.Image == null)
                return null;
            return "http://" +
                _httpAccessor.HttpContext.Request.Host.Value + 
                "/commons/images/" + 
                source.Image;
        }
    }
}
