using System.Collections.Generic;

namespace API.Entities
{
    public class UserCart
    {
        public UserCart()
        {
        }

        public UserCart(string id)
        {
            Id = id;
        }

        public string Id { get; set; }
        public List<CartItem> Items { get; set; } = new List<CartItem>();
        
    }
}
