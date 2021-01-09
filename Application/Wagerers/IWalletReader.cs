using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;


namespace Application.Wagerers
{
    public interface IWalletReader
    {
        decimal ReadWallet(Wagerer wagerer);
    }
}
