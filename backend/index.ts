import fastify from "fastify";
import mercurius from "mercurius";
import { schema } from "./api/schema";

const server = fastify();

server.register(mercurius, {
  schema,
  graphiql: true,
});

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.get("/", async function (req, reply) {
  const query = "{ add(x: 2, y: 2) }";
  return reply.graphql(query);
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit();
  }

  console.log(`Server listening at ${address}`);
});
