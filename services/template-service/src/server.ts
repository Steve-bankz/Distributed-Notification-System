import app from "./app.js";

const start = async () => {
  try {
    await app.ready();

    await app.listen({ port: app.config.PORT });
    console.log(`Template service listening on port ${app.config.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
