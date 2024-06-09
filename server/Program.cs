using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using server;
using server.Data;
using server.Middlewares;
using server.Repository;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Hangfire;
using server.Repository.IRepository;
using server.Services.IService;
using server.Services;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.SwaggerGen;
using Asp.Versioning;
using server.Utils.Email;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connString = builder.Configuration.GetConnectionString("DefaultSQLConnection");
builder.Services.AddDbContext<ApplicationDBContext>(opt =>
{
    opt.UseSqlServer(connString);
});

builder.Services.AddHangfire(x =>
{
    x.SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer().UseRecommendedSerializerSettings()
    .UseSqlServerStorage(connString);
});

var MyAllowAllOrigins = "_myAllowAllOrigins";

builder.Services.AddCors(x =>
{
    x.AddPolicy(name: "_myAllowAllOrigins", policy =>
    {
        policy.WithOrigins("*").WithHeaders("*").WithMethods("*");
    });
});

builder.Services.AddHangfireServer();

builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddScoped<IAssignmentRepository, AssignmentRepository>();
builder.Services.AddScoped<IAssignmentService, AssignmentService>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.TryAddSingleton<ITokenCleanupService, TokenCleanupService>();
builder.Services.AddTransient<IMailService, MailService>();

builder.Services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddAutoMapper(typeof(MappingConfig));

builder.Services.AddApiVersioning(opt =>
{
    opt.AssumeDefaultVersionWhenUnspecified = true;
    opt.DefaultApiVersion = new ApiVersion(1, 0);
    opt.ReportApiVersions = true;
}).AddMvc().AddApiExplorer(opt =>
{
    opt.GroupNameFormat = "'v'VVV";
    opt.SubstituteApiVersionInUrl = true;
});

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    var key = builder.Configuration.GetValue<string>("ApiSettings:Secret") ?? "";

    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration.GetValue<string>("ApiSettings:Issuer")!,
        ValidAudience = builder.Configuration.GetValue<string>("ApiSettings:Audience")!,
        ValidateAudience = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>, SwaggerConfigurationOptions>();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(opt => {
        opt.SwaggerEndpoint("/swagger/v1/swagger.json", "ToDo_API_V1");
    });
}

app.UseHangfireDashboard();
app.UseCors(MyAllowAllOrigins);
app.UseMiddleware<ExceptionMiddleware>();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

var tokenCleanupService = app.Services.GetRequiredService<ITokenCleanupService>();
RecurringJob.AddOrUpdate("RefreshTokenCleanupJob", () => tokenCleanupService.CleanupInvalidRefreshTokens(), "* * * * *");
RecurringJob.AddOrUpdate("UserTokenCleanupJob", () => tokenCleanupService.CleanupInvalidUserTokens(), "* * * * *");


app.Run();
