using API.Data;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StackExchange.Redis;
using System.Text.Json;
using API.DTOs;

namespace API.Controllers
{
    public class CartController : BaseApiController
    {
        private readonly IMapper _mapper;

        private readonly IDatabase _database;
        public CartController(IConnectionMultiplexer redis, IMapper mapper)
        {
            _database = redis.GetDatabase();
           _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<UserCart>> GetBasketById(string id)
        {
            var cart = await _database.StringGetAsync(id);

            var data= cart.IsNullOrEmpty ? null : JsonSerializer.Deserialize<UserCart>(cart); 

            return Ok(data);
        }

        [HttpPost]
        public async Task<ActionResult<UserCart>> UpdateBasket(UserCartDto cart)
        {
            var userCart = _mapper.Map<UserCartDto, UserCart>(cart);

            var created = await _database.StringSetAsync(cart.Id,
              JsonSerializer.Serialize(userCart), TimeSpan.FromDays(30));

            if (!created) return null;

            var data = await _database.StringGetAsync(cart.Id);

            var updatedCart = data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<UserCart>(data);

            return Ok(updatedCart);

        }


        [HttpDelete]
        public async Task DeleteBasketAsync(string id)
        {
             await _database.KeyDeleteAsync(id);
        }
        

    }
}
