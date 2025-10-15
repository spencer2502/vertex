import http from "http";
import SocketService from "./services/socket.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, "..", ".env") });

async function init() {
  const socketService = new SocketService();

  const httpServer = http.createServer();

  const PORT = process.env.PORT || 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  socketService.initListeners();
}

init();
