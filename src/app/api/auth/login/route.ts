import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || "";

// Fetch admin credentials from Strapi
async function getAdminCredentials(): Promise<{ email: string; password: string } | null> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (STRAPI_API_TOKEN) {
      headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
    }

    const response = await fetch(`${STRAPI_URL}/api/admin-credential`, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch admin credentials from Strapi");
      return null;
    }

    const data = await response.json();

    if (data.data && data.data.Email && data.data.Password) {
      return {
        email: data.data.Email,
        password: data.data.Password,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching admin credentials:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Fetch credentials from Strapi
    const adminCredentials = await getAdminCredentials();

    if (!adminCredentials) {
      return NextResponse.json(
        { error: "Erreur de configuration serveur" },
        { status: 500 }
      );
    }

    if (email === adminCredentials.email && password === adminCredentials.password) {
      // Create a simple token (in production, use JWT)
      const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");

      const response = NextResponse.json(
        { success: true, message: "Connexion réussie" },
        { status: 200 }
      );

      // Set cookie for session
      response.cookies.set("admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { error: "Email ou mot de passe incorrect" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
