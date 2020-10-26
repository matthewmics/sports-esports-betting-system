using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(string nameId, string tokenKey);
    }
}
