using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AutoMapper;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using API.Security;
using Microsoft.Extensions.FileProviders;
using System.IO;
using MediatR;
using Persistence;
using Infrastrucure.Security;
using Application.User;
using API.Middleware;
using Infrastructure.Photos;
using FluentValidation.AspNetCore;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Application.Photo;
using Application.Interfaces;
using API.SignalR;
using System.Threading.Tasks;
using Infrastructure.Paypal;
using Application.Paypal;
using Microsoft.AspNetCore.SignalR;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseMySQL(Configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddControllers()
                .AddFluentValidation(cfg =>
                {
                    cfg.RegisterValidatorsFromAssemblyContaining<Application.Team.Create>();
                });

            var builder = services.AddIdentityCore<AppUser>(opt =>
            {
                // set the password strength here.
                opt.Password.RequireDigit = false;
                opt.Password.RequiredUniqueChars = 0;
                opt.Password.RequireNonAlphanumeric = false;
            });
            var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.GetSection("AppSettings:TokenKey").Value));
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateAudience = false,
                        ValidateIssuer = false
                    };

                    opt.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;
                            if(!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                            {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddAuthorization(o =>
            {
                o.AddPolicy("IsAdmin", policy =>
                {
                    policy.Requirements.Add(new IsAdminRequirement());
                });
            });
            services.AddTransient<IAuthorizationHandler, IsAdminRequirementHandler>();

            services.AddAutoMapper(typeof(Application.Match.List));
            services.AddMediatR(typeof(Application.Match.List).Assembly);

            services.AddSignalR();
            services.AddSingleton<IUserIdProvider, EmailBasedUserIdProvider>();

            services.AddHttpClient();

            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IWalletReader, WalletReader>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.AddScoped<IImageHostGenerator, ImageHostGenerator>();
            services.AddScoped<IPaypalAccessor, PaypalAccessor>();

            services.Configure<PaypalSettings>(Configuration.GetSection("Paypal"));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            app.UseMiddleware<ErrorHandlingMiddleware>();
            //if (env.IsDevelopment())
            //{
            //    app.UseDeveloperExceptionPage();
            //}
            app.UseHttpsRedirection();

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                Path.Combine(env.ContentRootPath, "Uploads")),
                RequestPath = "/commons"
            });

            app.UseRouting();

            app.UseCors(builder =>
            {
                builder.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
            });

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chat");
            });
        }
    }
}
