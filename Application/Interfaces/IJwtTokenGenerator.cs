using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(string email, string tokenKey);
    }
}
