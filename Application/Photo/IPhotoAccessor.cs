using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Photo
{
    public interface IPhotoAccessor
    {
        PhotoUploadResult UploadPhoto(IFormFile file);
        bool DeletePhoto(string fileName);
    }
}
