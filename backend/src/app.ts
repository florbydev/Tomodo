// app.ts
import { buildServer } from "./server";

async function main() {
  const { server } = buildServer();

  try {
    const address = await server.listen({
      port: 8080,
      host: "0.0.0.0",
    });
    console.log(`Server listening at ${address}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}, shutting down...`);
    await server.close();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

void main();
