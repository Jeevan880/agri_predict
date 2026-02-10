import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
        index("routes/home.tsx"),
        route("login", "routes/login.tsx"),
        route("signup", "routes/signup.tsx"),
        route("pricing", "routes/pricing.tsx"),

        route("dashboard", "routes/dashboard/layout.tsx", [
                index("routes/dashboard/index.tsx"),
                route("profile", "routes/dashboard/profile.tsx"),
                route("recommend", "routes/dashboard/recommend.tsx"),
                route("market", "routes/dashboard/market-trends.tsx"),

        ]),
        route("dashboard", "routes/dashboard/layout.tsx", [
                index("routes/dashboard/index.tsx"),
                route("profile", "routes/dashboard/profile.tsx"),
                route("recommend", "routes/dashboard/recommend.tsx"),
                route("market", "routes/dashboard/market-trends.tsx"),
        ]),


] satisfies RouteConfig;


