export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/trades/:path*",
    "/accounts/:path*",
    "/journal/:path*",
    "/calendar/:path*",
    "/settings/:path*",
    "/api/accounts/:path*",
    "/api/trades/:path*",
    "/api/strategies/:path*",
    "/api/tags/:path*",
    "/api/journal/:path*",
    "/api/dashboard/:path*",
  ],
};
