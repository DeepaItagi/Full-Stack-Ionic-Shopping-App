using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.Orders;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class OrdersController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        private readonly IDatabase _database;
        public OrdersController(StoreContext context, IMapper mapper, IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();
            _context = context;
            _mapper = mapper;
        }


        [HttpPost]
        public async Task<ActionResult<Entities.Orders.Order>> CreateOrder(OrderDto orderDto)
        {
            var data = await _database.StringGetAsync(orderDto.CartId);

            var cart = data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<UserCart>(data);

            var items = new List<OrderItem>();
            foreach (var item in cart.Items)
            {
                var productItem = await _context.Products.FindAsync(item.Id);
                var orderItem = new OrderItem(productItem.Id, productItem.Name, productItem.ImageUrl, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }

            // calc subtotal
            var subtotal = items.Sum(item => item.Price * item.Quantity);

            // create order
            var order = new Entities.Orders.Order(items, subtotal);

            // save to db
            _context.Orders.Add(order);

            var result = await _context.SaveChangesAsync();


            return Ok(order);
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetOrdersForUser()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ToListAsync();

            return Ok(_mapper.Map<IReadOnlyList<Entities.Orders.Order>, IReadOnlyList<OrderToReturnDto>>(orders));
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrderByIdForUser(int id)
        {

            var order = await _context.Orders
              .Include(o => o.OrderItems)
              .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();

            return Ok(_mapper.Map<Entities.Orders.Order, OrderToReturnDto>(order));
        }

        [HttpDelete("{id}")]
        public async Task DeleteOrder(int id)
        {
            var order = _context.Orders.Include(o => o.OrderItems).SingleOrDefaultAsync(o => o.Id== id);

            _context.Orders.Remove(await order);

            await _context.SaveChangesAsync();
        }

    }
}
