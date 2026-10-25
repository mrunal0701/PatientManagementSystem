export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",   // protect entire dashboard
    "/api/patient/:path*", // protect APIs
  ],
};
