const express = require("express");
const uuid = require("uuid");
const port = 3000;
const app = express();
app.use(express.json());

const orders = [];

const checkUserId = (request, response, next) => {
  const { id } = request.params;

  const index = orders.findIndex((order) => order.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "User not found" });
  }

  request.orderIndex = index;
  request.orderId = id

  next()
};

const checkUrlMethod = (request, response, next) =>{
    const url = request.url
    const method = request.method

    console.log(url)
    console.log(method)
    
    next()
}
app.post('/order',checkUrlMethod, (request, response) => {
    const { order, clientName, price } = request.body
    const status = "Em preparação"
    const newOrder = { id: uuid.v4(), order, clientName, price, status }

    orders.push(newOrder)
  
    return response.status(201).json(newOrder)

    
  });

app.get("/order/",checkUrlMethod, (request, response) => {
  return response.json({ orders });
});


app.put('/order/:id', checkUserId ,checkUrlMethod, (request, response) => {
    const id = request.orderId
    const index = request.orderIndex

    const { order, clientName, price, status } = request.body
    const updateOrder = { id, order, clientName, price, status }


    orders[index] = updateOrder
    return response.json(updateOrder)
})


app.delete("/order/:id", checkUserId, checkUrlMethod, (request, response) => {
  const index = request.userIndex;

  orders.splice(index, 1);

  return response.status(204).json({ orders });
});

app.get('/order/:id', checkUserId ,checkUrlMethod, (request, response) => {
  const index = request.orderIndex
  
  const showOrders = orders[index]

  return response.json(showOrders)
})

app.patch('/order/:id', checkUserId, checkUrlMethod, (request, response) => {

  const { id } = request.params
  const { status } = request.body

  const currentOrderIndex = orders.findIndex(order => order.id === id)

  if (currentOrderIndex === -1) {

      return response.status(404).json({ error: "Pedido não cadastrado" })
  }

  orders[currentOrderIndex].status = status || 'Pedido pronto'

  return response.json({order: orders[currentOrderIndex] })
})

app.listen(3000, () => {
  console.log(`🚀 Server Started on port ${port}`);
});