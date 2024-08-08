using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace server.Filters
{
    public class TestingOnly : IResourceFilter
    {
        public void OnResourceExecuted(ResourceExecutedContext context)
        {
            ///
        }

        public void OnResourceExecuting(ResourceExecutingContext context)
        {
            var env = context.HttpContext.RequestServices.GetService<IWebHostEnvironment>();
            if (env != null && !env.IsStaging())
            {
                context.Result = new NotFoundResult();
            }
        }
    }
}
