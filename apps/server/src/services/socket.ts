import { Server } from "socket.io";
import { Redis } from "ioredis";
import type { RedisOptions } from "ioredis";

const pub = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  // Parse the port string into a base-10 number
  port: parseInt(process.env.REDIS_PORT || "13492", 10),
  username: process.env.REDIS_USERNAME || undefined,
  password: process.env.REDIS_PASSWORD || undefined,
});
const sub = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "13492", 10),
  username: process.env.REDIS_USERNAME || undefined,
  password: process.env.REDIS_PASSWORD || undefined ,
});

// Add error handlers
pub.on("error", (err) => console.error("Redis Publisher Error:", err));
sub.on("error", (err) => console.error("Redis Subscriber Error:", err));

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Service....");
    this._io = new Server({
      cors: {
        origin: "*",
        allowedHeaders: "*",
      },
    });
  }

  get io() {
    return this._io;
  }

  public initListeners() {
    const io = this._io;
    console.log("Init Socket Listeners....");
    io.on("connect", (socket) => {
      console.log("New client connected: ", socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New message received: ", message);

        await pub.publish("chat-messages", JSON.stringify({ message }));
      });
    });
  }
}

export default SocketService;
