import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("admin_session");

  if (!session || !session.value) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  try {
    const decoded = Buffer.from(session.value, "base64").toString("utf-8");
    const parts = decoded.split(":");

    let email: string, role: string, timestamp: string;

    if (parts.length === 3) {
      [email, role, timestamp] = parts;
    } else if (parts.length === 2) {
      [email, timestamp] = parts;
      role = "admin";
    } else {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    const sessionAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000;

    if (sessionAge > maxAge) {
      return NextResponse.json(
        { authenticated: false, reason: "Session expirée" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { authenticated: true, email, role },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}
