import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || "";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // DEBUG: Log configuration
    console.log("=== DEBUG PROPERTIES API ===");
    console.log("STRAPI_URL:", STRAPI_URL);
    console.log("Token present:", !!STRAPI_API_TOKEN);
    console.log("Token length:", STRAPI_API_TOKEN?.length || 0);
    console.log("Category filter:", category);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (STRAPI_API_TOKEN) {
      headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
    }

    let url = `${STRAPI_URL}/api/properties?sort=createdAt:desc`;

    if (category) {
      url += `&filters[category][$eq]=${category}`;
    }

    console.log("Full URL:", url);

    const response = await fetch(url, {
      headers,
      cache: "no-store",
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Strapi error response:", errorText);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des biens", details: errorText },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("Data received:", JSON.stringify(data, null, 2));
    console.log("Number of properties:", data.data?.length || 0);
    console.log("=== END DEBUG ===");

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: String(error) },
      { status: 500 }
    );
  }
}
