import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const { createRequestHandler } = await import("../../build/server/index.js");
  
  const handleRequest = createRequestHandler({
    build: await import("../../build/server/index.js"),
    mode: process.env.NODE_ENV,
  });

  return handleRequest(request);
};