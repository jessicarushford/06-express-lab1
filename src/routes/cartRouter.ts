// require the express module
import express from "express";
import CartItem from "../models/CartItem";

// create a new Router object
const cartRouter = express.Router();

const cart: CartItem[] = [
  { id: 1, product: "vegan cheese", price: 9, quantity: 5 },
  { id: 2, product: "bread", price: 4, quantity: 2 },
  { id: 3, product: "onion", price: 1, quantity: 99 },
];

let nextId: number = 4;

cartRouter.get("/cart-items", (req, res) => {
  const { maxPrice, prefix, pageSize } = req.query;
  let filteredArray: CartItem[] = cart;
  //   const index: number = cart.findIndex((item) => item.id === id);
  if (maxPrice) {
    filteredArray = filteredArray.filter(
      (item) => item.price <= parseInt(maxPrice as string)
    );
  }
  if (prefix) {
    filteredArray = filteredArray.filter((item) =>
      item.product.startsWith(prefix as string)
    );
  }
  if (pageSize) {
    filteredArray = filteredArray.slice(0, parseInt(pageSize as string));
  }
  res.status(200);
  res.json(filteredArray);
});

cartRouter.get("/cart-items/:id", (req, res) => {
  const id: number = parseInt(req.params.id);
  const index: number = cart.findIndex((item) => item.id === id);
  if (id === -1) {
    res.status(404);
    res.send("ID Not Found");
  } else {
    res.status(200);
    res.json(cart[index]);
  }
});

cartRouter.post("/cart-items", (req, res) => {
  const newCartItem: CartItem = req.body;
  newCartItem.id = nextId++;
  cart.push(newCartItem);
  res.status(201);
  res.json(newCartItem);
});

cartRouter.put("/cart-items/:id", (req, res) => {
  const updatedCartItem: CartItem = req.body;
  const id: number = parseInt(req.params.id);
  updatedCartItem.id = id;
  //   for the if index === -1 statement
  const index: number = cart.findIndex((item) => item.id === id);
  if (index === -1) {
    res.status(404);
    res.send(`The ID of ${id} was not found`);
  } else {
    cart[index] = updatedCartItem;
    res.status(200);
    res.json(updatedCartItem);
  }
});

cartRouter.delete("/cart-items/:id", (req, res) => {
  const id: number = parseInt(req.params.id);
  const index: number = cart.findIndex((item) => item.id === id);
  cart.splice(index, 1);
  res.sendStatus(204);
});
// used FindIndex instead of Find so you can use SPLICE

export default cartRouter;
