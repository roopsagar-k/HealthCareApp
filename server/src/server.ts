import { app } from "./app";
import { serverConfig } from "./config";
import { initializeFirebase } from "./firebase";

const startServer = async () => {
  app.listen(serverConfig.apiPort, () => {
    console.log(`🚀 Server is running at the port ${serverConfig.apiPort}`);
  });

  initializeFirebase();
};

startServer();
