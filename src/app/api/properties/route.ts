import { NextRequest, NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let path = "properties?select=*&order=created_at.desc";
    if (category) {
      path += `&category=eq.${category}&visible=eq.true`;
    }

    const res = await supabaseRest(path);
    const rawData = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: "Erreur lors de la récupération des biens", details: JSON.stringify(rawData) },
        { status: 500 }
      );
    }

    const mappedData = (rawData || []).map((row: Record<string, unknown>) => ({
      id: row.id,
      documentId: row.document_id,
      name: row.name,
      location: row.location,
      description: row.description,
      rooms: row.rooms,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      surface: row.surface,
      surfaceUnit: row.surface_unit || "m2",
      price: row.price,
      views: row.views,
      type: row.type,
      parking: row.parking,
      propertyId: row.property_id,
      category: row.category,
      images: row.images,
      visible: row.visible !== false,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ data: mappedData }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (!session?.value) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let role = "admin";
  try {
    const decoded = Buffer.from(session.value, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length === 3) role = parts[1];
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (role !== "dev") {
    return NextResponse.json({ error: "Accès réservé aux développeurs" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      name, location, description, rooms, bedrooms, bathrooms,
      surface, surface_unit, price, type, parking, category, images,
      visible_from, nearby_visits,
    } = body;

    if (!name || !location || !category) {
      return NextResponse.json({ error: "Nom, lieu et catégorie sont requis" }, { status: 400 });
    }

    // Count existing properties for auto-ID
    const countRes = await supabaseRest("properties?select=id", { method: "HEAD", headers: { "Prefer": "count=exact" } });
    const count = parseInt(countRes.headers.get("content-range")?.split("/")[1] || "0");
    const propertyId = `P${String(count + 1).padStart(3, "0")}`;

    const insertRes = await supabaseRest("properties", {
      method: "POST",
      body: JSON.stringify({
        name,
        location,
        description: description || "",
        rooms: rooms || 0,
        bedrooms: bedrooms || 0,
        bathrooms: bathrooms || 0,
        surface: surface || 0,
        surface_unit: surface_unit || "m2",
        price: String(price || "0"),
        type: type || null,
        parking: parking || 0,
        property_id: propertyId,
        category: category.toLowerCase(),
        images: images || null,
        visible_from: visible_from || null,
        nearby_visits: nearby_visits || null,
      }),
    });

    const insertData = await insertRes.json();

    if (!insertRes.ok) {
      return NextResponse.json(
        { error: "Erreur lors de la création du bien", details: JSON.stringify(insertData) },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: insertData, propertyId },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
