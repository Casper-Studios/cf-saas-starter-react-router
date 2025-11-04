import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/api/trpc/*", "routes/api/trpc.$.ts"),
  route("/api/auth/*", "routes/api/auth.$.ts"),
  route("/bucket/upload", "routes/bucket/upload.ts"),
] satisfies RouteConfig;
