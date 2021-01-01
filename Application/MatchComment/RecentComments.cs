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
using System.Linq;
using Application.MatchComment.Dtos;

namespace Application.MatchComment
{
    public class RecentComments
    {

        public class Query : IRequest<List<MatchCommentDto>>
        {
            public int MatchId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<MatchCommentDto>>
        {
            private readonly DataContext _ctx;
            private readonly IMapper _mapper;

            public Handler(DataContext ctx, IMapper mapper)
            {
                _ctx = ctx;
                _mapper = mapper;
            }

            public async Task<List<MatchCommentDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var match = await _ctx.Matches
                    .SingleOrDefaultAsync(x => x.Id == request.MatchId);
                if (match == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Match = "Not found" } );

                var comments = await _ctx.MatchComments.Include(x => x.Wagerer).ThenInclude(x => x.AppUser)
                    .Where(x => x.MatchId == match.Id)
                    .OrderByDescending(x => x.CreatedAt).Take(20).ToListAsync();

                return _mapper.Map<List<MatchCommentDto>>(comments);
            }
        }

    }
}
