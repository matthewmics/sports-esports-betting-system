using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.User
{
    public class UserDto : BaseUser
    {       
        public decimal WalletBalance { get; set; }
    }
}
