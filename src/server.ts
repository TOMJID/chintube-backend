import { envConfig } from "./app/config/env.config";
import app from "./app";


const bootstrap = () => {
  try {
    if (process.env.NODE_ENV !== "production") {
      app.listen(envConfig.PORT, () => {
        console.log(`Server is running on http://localhost:${envConfig.PORT}`);
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

bootstrap();
