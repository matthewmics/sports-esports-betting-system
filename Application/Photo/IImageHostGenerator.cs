using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Photo
{
    public interface IImageHostGenerator
    {
        string GetHostImage(string imageName);
    }
}
