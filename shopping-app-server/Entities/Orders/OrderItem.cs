

namespace API.Entities.Orders
{
    public class OrderItem : BaseEntity
    {
        public OrderItem()
        {
        }

        public OrderItem(int productItemId, string productName, string imageUrl, double price, int quantity)
        {
            ProductItemId = productItemId;
            ProductName = productName;
            ImageUrl = imageUrl; ;
            Price = price;
            Quantity = quantity;
        }

        public int ProductItemId { get; set; }
        public string ProductName { get; set; }
        public string ImageUrl { get; set; }
        public double Price { get; set; }
        public int Quantity
        {
            get; set;
        }
    }
}