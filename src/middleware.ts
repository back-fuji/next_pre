export { auth as middleware } from "@/lib/auth";

export const config = {
  // Route Group (dashboard) はURLパスに含まれないため注意
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/workspace/:path*",
    "/settings/:path*",
  ],
};
