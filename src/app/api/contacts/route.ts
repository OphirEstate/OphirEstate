import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || "";

// Middleware to check authentication
function isAuthenticated(request: NextRequest): boolean {
  const session = request.cookies.get("admin_session");
  if (!session || !session.value) return false;

  try {
    const decoded = Buffer.from(session.value, "base64").toString("utf-8");
    const [, timestamp] = decoded.split(":");
    const sessionAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000;
    return sessionAge <= maxAge;
  } catch {
    return false;
  }
}

// GET - Fetch all contacts
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (STRAPI_API_TOKEN) {
      headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
    }

    const response = await fetch(
      `${STRAPI_URL}/api/contact-submissions?sort=createdAt:desc`,
      {
        headers,
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Strapi error:", errorData);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des contacts" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
