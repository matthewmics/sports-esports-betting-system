using Application.Interfaces;
using Application.Photo;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        public PhotoUploadResult UploadPhoto(IFormFile file)
        {
            bool isSaveSuccess = false;
            string fileName;
            try
            {

                string extension = file.ContentType switch
                {
                    "image/png" => ".png",
                    "image/jpeg" => ".jpg",
                    _ => null
                };

                if (file.Length > 4_000_000 || (extension != ".png" && extension != ".jpg"))
                {
                    throw new Exception("Photos should be less than 4 MB and saved as JPG or PNG");
                }

                fileName = Guid.NewGuid().ToString("N") + extension;

                var pathBuilt = Path.Combine(Directory.GetCurrentDirectory(), "Uploads\\images");

                if (!Directory.Exists(pathBuilt))
                {
                    Directory.CreateDirectory(pathBuilt);
                }

                var path = Path.Combine(Directory.GetCurrentDirectory(), "Uploads\\images",
                   fileName);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    file.CopyToAsync(stream).Wait();
                }

                isSaveSuccess = true;
            }
            catch (Exception)
            {
                fileName = null;
            }

            return new PhotoUploadResult
            {
                FileName = fileName, 
                IsSuccess = isSaveSuccess
            };
        }

        public bool DeletePhoto(string fileName)
        {
            throw new NotImplementedException();
        }

    }
}
