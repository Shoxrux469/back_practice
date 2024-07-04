const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  products: [
    {
      product: {
        type: Object,
        // ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
});

orderSchema.methods.addOrder = function () {
  return this.getCart()
    .then((products) => {
      const order = {
        items: products,
        user: {
          _id: new ObjectId(this._id),
          name: this.name,
        },
      };
      return db.collection("orders").insertOne(order);
    })
    .then((result) => {
      this.cart = { items: [] };
      return db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(this._id) },
          { $set: { cart: { items: [] } } }
        );
    });
};

module.exports = mongoose.model("Order", orderSchema);
