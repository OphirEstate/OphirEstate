import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || "";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (STRAPI_API_TOKEN) {
      headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
    }

    let url = `${STRAPI_URL}/api/properties?populate=images&sort=createdAt:desc`;

    if (category) {
      url += `&filters[category][$eq]=${category}`;
    }

    const response = await fetch(url, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Strapi error:", await response.text());
      return NextResponse.json(
        { error: "Erreur lors de la récupération des biens" },
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
