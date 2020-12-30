using Application.Photo;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Photos
{
    public class ImageHostGenerator : IImageHostGenerator
    {
        private readonly IHttpContextAccessor _httpContext;

        public ImageHostGenerator(IHttpContextAccessor httpContext)
        {
            _httpContext = httpContext;
        }
        public string GetHostImage(string imageName)
        {
            return "http://" +
                _httpContext.HttpContext.Request.Host.Value +
                "/commons/images/" +
                imageName;
        }
    }
}
