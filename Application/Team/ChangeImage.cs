using Application.Errors;
using Application.Photo;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Team
{
    public class ChangeImage
    {

        public class Command : IRequest
        {
            public int Id { get; set; }
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;

            public Handler(DataContext context, IPhotoAccessor photoAccessor)
            {
                _context = context;
                _photoAccessor = photoAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var team = await _context.Teams.FindAsync(request.Id);
                if (team == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Team = "Team not found" });

                if (!string.IsNullOrEmpty(team.Image))
                if (!_photoAccessor.DeletePhoto(team.Image))
                    throw new Exception("Problem deleting photo");

                var uploadResult = _photoAccessor.UploadPhoto(request.File);

                if(!uploadResult.IsSuccess)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest,
                        new { Photo = "Photo should be less than 4 MB and saved as JPG or PNG" });

                team.Image = uploadResult.FileName;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }

    }
}
