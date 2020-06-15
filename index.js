require("dotenv").config();

const host = process.env.HOST ?? "0.0.0.0";
const port = process.env.PORT ?? "4000";

function parseEnvList(envVariable) {
  return envVariable?.split(",") ?? [];
}

const originWhitelist = parseEnvList(process.env.CORSANYWHERE_WHITELIST);

const corsProxy = require("cors-anywhere");
corsProxy
  .createServer({
    originWhitelist,
    requireHeader: ["origin", "x-requested-with"],
    removeHeaders: [
      "cookie",
      "cookie2",
      // Strip Heroku-specific headers
      "x-heroku-queue-wait-time",
      "x-heroku-queue-depth",
      "x-heroku-dynos-in-use",
      "x-request-start",
    ],
    redirectSameOrigin: true,
    httpProxyOptions: {
      // Do not add X-Forwarded-For, etc. headers, because Heroku already adds it.
      xfwd: false,
    },
  })
  .listen(port, host, () =>
    console.log(`Jeremy's CORS Anywhere server is running on ${host}:${port}`)
  );
