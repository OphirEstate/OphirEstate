import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("admin_session");

  if (!session || !session.value) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  // Verify the token is valid (simple check)
  try {
    const decoded = Buffer.from(session.value, "base64").toString("utf-8");
    const [email, timestamp] = decoded.split(":");

    // Check if session is expired (24 hours)
    const sessionAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in ms

    if (sessionAge > maxAge) {
      return NextResponse.json(
        { authenticated: false, reason: "Session expirée" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { authenticated: true, email },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}
