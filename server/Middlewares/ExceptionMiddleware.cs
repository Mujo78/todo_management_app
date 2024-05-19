using Microsoft.AspNetCore.Mvc;
using server.Exceptions;

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
            var(statusCode, problemDetails) = HandleException(ex);

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";
            
            await context.Response.WriteAsJsonAsync(problemDetails);
        }

        private (int statusCode, ProblemDetails problemDetails) HandleException(Exception ex)
        {
            int statusCode;
            var problemDetails = new ProblemDetails()
            {
                Type = ex.GetType().Name,
                Detail = ex.Message
            };
            switch (ex)
            {
                case NotFoundException:
                   statusCode = StatusCodes.Status404NotFound;
                    problemDetails.Status = statusCode;
                    problemDetails.Title = "Resource not found.";
                    break;
                case ConflictException:
                    statusCode = StatusCodes.Status409Conflict;
                    problemDetails.Status = statusCode;
                    problemDetails.Title = "Conflict error.";
                    break;
                case ForbidException:
                    statusCode = StatusCodes.Status403Forbidden;
                    problemDetails.Status = statusCode;
                    problemDetails.Title = "Forbidden";
                    break;
                default:
                    statusCode = StatusCodes.Status500InternalServerError;
                    problemDetails.Status = statusCode;
                    problemDetails.Title = "An error occured while processing your request.";
                    break;
            }

            return (statusCode, problemDetails);
        }
    }
}
