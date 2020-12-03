using Application.Errors;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Application.Team
{
    public class Create
    {
        public class Command : IRequest
        {
            public IFormFile File { get; set; }

            public string Name { get; set; }    
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Name).NotEmpty();
                RuleFor(x => x.File).NotEmpty();
            }
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
                var photoUpload = _photoAccessor.UploadPhoto(request.File);
                if (!photoUpload.IsSuccess)
                    throw new Exception("Something went wrong while uploading photo");

                var team = await _context.Teams.FirstOrDefaultAsync(x => x.Name == request.Name);
                if (team != null)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { Team = "Team already exists"});

                team = new Domain.Team
                {
                   Name= request.Name,
                   Image = photoUpload.FileName,
                   CreatedAt = DateTime.Now                   
                };

                _context.Teams.Add(team);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }

    }
}
