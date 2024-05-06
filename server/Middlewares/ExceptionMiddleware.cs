using Microsoft.AspNetCore.Mvc;

namespace server.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                await ProcessException(context, ex);
            }
        }

        private async Task ProcessException(HttpContext context, Exception ex)
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";

            var problemDetails = new ProblemDetails()
            {
                Status = context.Response.StatusCode,
                Title = "An error occured while processing your request.",
                Type = ex.GetType().Name,
            };

            await context.Response.WriteAsJsonAsync(problemDetails);
        }
    }
}
