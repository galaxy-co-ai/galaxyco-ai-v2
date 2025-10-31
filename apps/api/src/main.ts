import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables before anything else
config({ path: resolve(__dirname, "../../../.env.local") });
config({ path: resolve(__dirname, "../.env.local") });

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}`);
}
bootstrap();
