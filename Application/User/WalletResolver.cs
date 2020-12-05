﻿using Domain;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Application.Interfaces;
using Persistence;
using Application.User;

namespace Application.User
{
    public class WalletResolver : IValueResolver<AppUser, UserDto, decimal>
    {
        private readonly IWalletReader _walletReader;
        private readonly DataContext _ctx;

        public WalletResolver(IWalletReader walletReader, DataContext dataContext)
        {
            _walletReader = walletReader;
            _ctx = dataContext;
        }

        public decimal Resolve(AppUser source, UserDto destination, decimal destMember, ResolutionContext context)
        {
            var customer = _ctx.Customers.SingleAsync(x => x.AppUserId == source.Id).Result;
            return _walletReader.ReadWallet(customer);            
        }
    }
}