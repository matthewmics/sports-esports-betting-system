using Domain;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.User.Dtos;

namespace Application.Wagerers
{
    public class WalletResolver : IValueResolver<Wagerer, UserDto, decimal>
    {
        private readonly IWalletReader _walletReader;

        public WalletResolver(IWalletReader walletReader)
        {
            _walletReader = walletReader;
        }

        public decimal Resolve(Wagerer source, UserDto destination, decimal destMember, ResolutionContext context)
        {
            return _walletReader.ReadWallet(source);
        }
    }
}
