import {
  floatArg,
  idArg,
  intArg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";

export const mockProducts = [
  {
    id: "prod-1",
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with adjustable DPI",
    price: 2999,
    tags: ["electronics", "accessories", "wireless"],
    inStock: true,
  },
  {
    id: "prod-2",
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with blue switches",
    price: 8999,
    tags: ["electronics", "keyboard", "mechanical"],
    inStock: true,
  },
  {
    id: "prod-3",
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub with HDMI and Ethernet",
    price: 4999,
    tags: ["electronics", "usb-c", "accessories"],
    inStock: false,
  },
  {
    id: "prod-4",
    name: "Noise Cancelling Headphones",
    description: "Over-ear headphones with active noise cancellation",
    price: 15999,
    tags: ["electronics", "audio", "headphones"],
    inStock: true,
  },
  {
    id: "prod-5",
    name: "Laptop Stand",
    description: "Adjustable aluminum laptop stand for better ergonomics",
    price: 3499,
    tags: ["office", "accessories", "ergonomics"],
    inStock: true,
  },
];

export const mockCarts = [
  {
    id: "cart-1",
    totalPrice: 11997,
    items: [
      {
        quantity: 2,
        product: {
          id: "prod-1",
          name: "Wireless Mouse",
          description: "Ergonomic wireless mouse with adjustable DPI",
          price: 2999,
          tags: ["electronics", "accessories", "wireless"],
          inStock: true,
        },
      },
      {
        quantity: 1,
        product: {
          id: "prod-2",
          name: "Mechanical Keyboard",
          description: "RGB backlit mechanical keyboard",
          price: 5999,
          tags: ["electronics", "keyboard", "mechanical"],
          inStock: true,
        },
      },
    ],
  },
  {
    id: "cart-2",
    totalPrice: 3499,
    items: [
      {
        quantity: 1,
        product: {
          id: "prod-3",
          name: "Laptop Stand",
          description: "Adjustable aluminum laptop stand",
          price: 3499,
          tags: ["office", "accessories", "ergonomics"],
          inStock: true,
        },
      },
    ],
  },
];

export const Product = objectType({
  name: "Product",
  definition(t) {
    t.nonNull.id("id"),
      t.nonNull.string("name"),
      t.nonNull.string("description"),
      t.nonNull.int("price"),
      t.nonNull.list.nonNull.string("tags"),
      t.boolean("inStock");
  },
});

export const CartItem = objectType({
  name: "CartItem",
  definition(t) {
    t.field("product", {
      type: "Product",
      resolve() {
        return {};
      },
    }),
      t.nonNull.int("quantity");
  },
});

export const Cart = objectType({
  name: "Cart",
  definition(t) {
    t.nonNull.id("id"),
      t.nonNull.float("totalPrice"),
      t.nonNull.list.nonNull.field("items", {
        type: "CartItem",
        resolve() {
          return [];
        },
      });
  },
});

export const ECommerceQuery = queryField((t) => {
  t.field("products", {
    type: nonNull(list(nonNull("Product"))),
    args: {
      search: stringArg(),
      tag: stringArg(),
      minPrice: floatArg(),
      maxPrice: floatArg(),
    },
    resolve() {
      return mockProducts;
    },
  }),
    t.field("product", {
      type: "Product",
      args: {
        id: nonNull(idArg()),
      },
      resolve(_parent, args, ctx) {
        //find product by id.
        return mockProducts[0];
      },
    }),
    t.field("cart", {
      type: "Cart",
      args: {
        id: nonNull(idArg()),
      },
      resolve(_parent, args, ctx) {
        //use id to look for the specific cart data.
        return mockCarts[0];
      },
    });
});

export const ECommerceMutation = mutationField((t) => {
  t.field("createCart", {
    type: nonNull("Cart"),
    resolve() {
      return {
        id: "asdlkj1231",
        totalPrice: 0,
        items: [],
      };
    },
  }),
    t.field("addItemToCart", {
      type: nonNull("Cart"),
      args: {
        cartId: nonNull(idArg()),
        productId: nonNull(idArg()),
        quantity: nonNull(intArg()),
      },
      resolve(_parent, args, _ctx) {
        //find cart via cartId.
        //find product via productId
        //get price from product then multiply by quantity to get totalPrice
        //create CartItem with the extracted product data, and quantity
        //add to pulled the pulled list of data via cart.
        //return combined list.
        return mockCarts[1];
      },
    }),
    t.field("removeItemFromCart", {
      type: nonNull("Cart"),
      args: {
        cartId: nonNull(idArg()),
        productId: nonNull(idArg()),
      },
      resolve(_parent, args, ctx) {
        // pull cart data via cartId,
        // find product from the pulled list by productId, then remove.
        // return cart with the new list.
        return mockCarts[0];
      },
    }),
    t.field("updateCartItem", {
      type: nonNull("Cart"),
      args: {
        cartId: nonNull(idArg()),
        productId: nonNull(idArg()),
        quantity: nonNull(intArg()),
      },
      resolve(_parent, args, _ctx) {
        // find cart by cartId
        // find product from the pulled list.
        // update quantity. If quantity is zero, remove item.
        return mockCarts[0];
      },
    });
});
