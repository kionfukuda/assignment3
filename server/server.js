const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const productsDB = [
  {
    id: 1, category: "Shirts", name: 'DressShirts', price: 45, 
    image: "https://slimages.macysassets.com/is/image/MCY/products/4/optimized/8133814_fpx.tif?op_sharpen=1&wid=402&hei=489&fit=fit,1&$filtersm$&fmt=webp"

  },
];

const CategoryType = {
  Shirts: "Shirts",
  Jeans: "Jeans",
  Jackets: "Jackets",
  Sweaters: "Sweaters",
  Accessories: "Accessories",
};

const resolvers  = {
  Query: {
    productList,
  },
  Mutation: {
    productAdd,
  },
  CategoryType
};

function productList() {
  return productsDB;
}

function productAdd(_, { product }) {
  product.id = productsDB.length + 1;
  productsDB.push(product);
  return product;
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();

app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

app.listen(3000, function () {
console.log('App started on port 3000');
});