using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Application.Profile.Dtos;
using Microsoft.AspNetCore.Http;
using Application.Photo;
using Application.Interfaces;

namespace Application.Profile
{
    public class ChangePhoto
    {

        public class Command : IRequest<ChangePhotoDto>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, ChangePhotoDto>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            private readonly IImageHostGenerator _imageHostGenerator;

            public Handler(DataContext context, IPhotoAccessor accessor, IUserAccessor userAccessor, 
                IImageHostGenerator imageHostGenerator)
            {
                _context = context;
                _photoAccessor = accessor;
                _userAccessor = userAccessor;
                _imageHostGenerator = imageHostGenerator;
            }

            public async Task<ChangePhotoDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var wagerer = await _context.Wagerers.SingleOrDefaultAsync(x => x.AppUser.Email == _userAccessor.GetCurrentEmail());
                if (wagerer == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Wagerer = "Wagerer not found" });

                if (wagerer.ProfilePhoto != null)
                    _photoAccessor.DeletePhoto(wagerer.ProfilePhoto);

                var uploadResult = _photoAccessor.UploadPhoto(request.File);

                if (!uploadResult.IsSuccess)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest,
                        new { Photo = "Photo should be less than 4 MB and saved as JPG or PNG" });

                wagerer.ProfilePhoto = uploadResult.FileName;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return new ChangePhotoDto
                    {
                        PhotoUrl = _imageHostGenerator.GetHostImage(uploadResult.FileName)
                    };

                throw new Exception("Problem saving changes");
            }
        }

    }
}
