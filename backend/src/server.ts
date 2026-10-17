import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

async function startServer(): Promise<void> {
  try {
    const { default: app } = await import("./app.js");

    app.listen(PORT, () => {
      console.log(`Web Push Notification backend running on port ${PORT}`);

      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error: unknown) {
    console.error("Failed to start the server:", error);

    process.exitCode = 1;
  }
}

startServer();
