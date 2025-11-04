import {
  type RouteConfig,
  index,
  route,
  prefix,
  layout,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/api/trpc/*", "routes/api/trpc.$.ts"),
  route("/api/auth/*", "routes/api/auth.$.ts"),
  route("/api/upload-file", "routes/api/upload-file.ts"),
  ...prefix("admin", [
    layout("routes/admin/layout.tsx", [
      route("/users", "routes/admin/users.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
