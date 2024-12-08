import cluster from "cluster";
import { cpus } from "os";
import { MessageRelaySystem } from "./MessageRelaySystem.js";
import { PushBot } from "./PushBot.js";

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers
  const numCPUs = cpus().length;
  const WORKERS = process.env.WORKERS || numCPUs;

  // Fork workers with environment variables
  cluster.fork({
    ...process.env,
    WORKER_TYPE: "relay",
  });

  cluster.fork({
    ...process.env,
    WORKER_TYPE: "pushbot",
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died. Signal: ${signal}. Code: ${code}`
    );
    console.log("Starting a new worker...");

    // Get the worker type and restart with same environment
    const workerType = worker.process.env.WORKER_TYPE;
    cluster.fork({
      ...process.env,
      WORKER_TYPE: workerType,
    });
  });

  cluster.on("online", (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });
} else {
  // Worker process
  const workerType = process.env.WORKER_TYPE;
  console.log(`Worker ${process.pid} started as ${workerType}`);

  if (workerType === "relay") {
    const relay = new MessageRelaySystem();
    setupWorker(relay);
  } else if (workerType === "pushbot") {
    const bot = new PushBot();
    setupWorker(bot);
  } else {
    console.error(`Unknown worker type: ${workerType}`);
    process.exit(1);
  }
}

async function setupWorker(instance) {
  // Error handling
  process.on("uncaughtException", async (error) => {
    console.error("Uncaught Exception:", error);
    await cleanup(instance);
    process.exit(1);
  });

  process.on("unhandledRejection", async (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    await cleanup(instance);
    process.exit(1);
  });

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("SIGTERM signal received.");
    await cleanup(instance);
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    console.log("SIGINT signal received.");
    await cleanup(instance);
    process.exit(0);
  });

  // Start with retry
  startWithRetry(instance);
}

async function cleanup(instance) {
  console.log("Cleaning up...");
  try {
    await instance.cleanup();
    console.log("Cleanup completed");
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

async function startWithRetry(instance, retries = 5, delay = 5000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await instance.initialize();
      console.log(`${instance.constructor.name} initialized successfully`);
      return;
    } catch (error) {
      console.error(
        `Failed to initialize ${instance.constructor.name} (attempt ${attempt}/${retries}):`,
        error
      );

      if (attempt === retries) {
        console.error("Max retries reached. Exiting...");
        process.exit(1);
      }

      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
