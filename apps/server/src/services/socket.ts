import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
  username: "default",
  password: process.env.NEXT_PUBLIC_REDIS_PASSWORD,
  host: "redis-125b0165-koyalkaraditya123-3f55.f.aivencloud.com",
  port: 13849,
});
const sub = new Redis({
  username: "default",
  password: process.env.NEXT_PUBLIC_REDIS_PASSWORD,
  host: "redis-125b0165-koyalkaraditya123-3f55.f.aivencloud.com",
  port: 13849,
});

class SocketService {
  private _io: Server;
  constructor() {
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
    console.log("Init Socket Server");
  }
  public initListeners() {
    const io = this._io;
    console.log("Initialized socket listeners");
    io.on("connect", (socket) => {
      console.log(`New Socket Connected`, socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log(`Message is ${message}`);
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });
    sub.on("message", (channel, message) => {
      if (channel == "MESSAGES") {
        io.emit("message", message);
      }
    });
  }
  get io() {
    return this._io;
  }
}

export default SocketService;
