import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const backendUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
  return NextResponse.redirect(new URL("/api/auth/google", backendUrl));
}
