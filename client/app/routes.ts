import { type RouteConfig, index,route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("signup", "routes/signup.tsx"),

    route("dashboard", "routes/dashboard/layout.tsx", [
        index("routes/dashboard/index.tsx"),
        route("profile", "routes/dashboard/profile.tsx"),
    ]),


] satisfies RouteConfig;

