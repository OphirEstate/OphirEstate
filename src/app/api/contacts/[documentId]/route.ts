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

// DELETE - Delete a contact by documentId
export async function DELETE(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const { documentId } = params;

  if (!documentId) {
    return NextResponse.json(
      { error: "ID du document requis" },
      { status: 400 }
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
      `${STRAPI_URL}/api/contact-submissions/${documentId}`,
      {
        method: "DELETE",
        headers,
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Strapi delete error:", errorData);
      return NextResponse.json(
        { error: "Erreur lors de la suppression" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Contact supprimé" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
