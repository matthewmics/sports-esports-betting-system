using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace Application.MatchComment
{
    public class Create
    {

        public class Command : IRequest<Dtos.MatchCommentDto>
        {
            public string Email { get; set; }
            public string Message { get; set; }
            public int MatchId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Dtos.MatchCommentDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Dtos.MatchCommentDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var wagerer = await _context.Wagerers
                    .Include(x => x.AppUser)
                    .SingleOrDefaultAsync(x => x.AppUser.Email == request.Email);
                if (wagerer == null) throw new RestException(System.Net.HttpStatusCode.NotFound, new { Wagerer = "Not found" });

                var comment = new Domain.MatchComment
                {
                    Wagerer = wagerer,
                    CreatedAt = DateTime.Now,
                    MatchId = request.MatchId,
                    Message = request.Message,
                };

                _context.MatchComments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return _mapper.Map<Dtos.MatchCommentDto>(comment);

                throw new Exception("Problem saving changes");
            }
        }

    }
}
