using System;
using System.Collections.Generic;


namespace API.Entities.Orders
{
    public class Order : BaseEntity
    {
        public Order()
        {
        }

        public Order(IReadOnlyList<OrderItem> orderItems, double subtotal)
        {
            OrderItems = orderItems;
            Subtotal = subtotal;
        }

        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.Now;
        public IReadOnlyList<OrderItem> OrderItems { get; set; }
        public double Subtotal { get; set; }

        public double GetTotal()
        {
            return Subtotal;
        }
    }
}
