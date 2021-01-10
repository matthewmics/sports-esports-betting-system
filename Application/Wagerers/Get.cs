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
using Application.Wagerers.Dtos;
using AutoMapper;

namespace Application.Wagerers
{
    public class Get
    {

        public class Query : IRequest<WagererDto>
        {
            public string Email { get; set; }
        }

        public class Handler : IRequestHandler<Query, WagererDto>
        {
            private readonly DataContext _ctx;
            private readonly IMapper _mapper;

            public Handler(DataContext ctx, IMapper mapper)
            {
                _ctx = ctx;
                _mapper = mapper;
            }

            public async Task<WagererDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var wagerer = await _ctx.Wagerers.Include(x => x.AppUser).SingleOrDefaultAsync(x => x.AppUser.Email == request.Email);
                if (wagerer == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Wagerer = "Wagerer not found" });

                return _mapper.Map<WagererDto>(wagerer);
            }
        }

    }
}
