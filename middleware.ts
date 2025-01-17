import { NextResponse } from "next/server";

export function middleware(request: any) {
  const sessionCartId = request.cookies.get("sessionCartId");

  if (!sessionCartId) {
    const newCartId = crypto.randomUUID();

    // Clone the req headers
    const newRequestHeaders = new Headers(request.headers);

    const response = NextResponse.next({
      request: {
        headers: newRequestHeaders,
      },
    });
    response.cookies.set("sessionCartId", newCartId);

    return response;
  }

  return NextResponse.next();
}
