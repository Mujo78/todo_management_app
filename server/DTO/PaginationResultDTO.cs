namespace server.DTO
{
    public class PaginationResultDTO<T>(IEnumerable<T> data, int PageNum, int TotalCount)
    {
        public IEnumerable<T> Data { get; set; } = data;
        public int PageNum { get; set; } = PageNum;
        public int TotalCount { get; set; } = TotalCount;
    }
}
