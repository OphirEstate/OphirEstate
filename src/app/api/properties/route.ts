import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des biens", details: error.message },
        { status: 500 }
      );
    }

    const mappedData = (data || []).map((row) => ({
      id: row.id,
      documentId: row.document_id,
      name: row.name,
      location: row.location,
      description: row.description,
      rooms: row.rooms,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      surface: row.surface,
      price: row.price,
      views: row.views,
      type: row.type,
      parking: row.parking,
      propertyId: row.property_id,
      category: row.category,
      images: row.images,
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
  // Verify auth + dev role
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
      surface, price, type, parking, category, images,
      visible_from, nearby_visits,
    } = body;

    if (!name || !location || !category) {
      return NextResponse.json(
        { error: "Nom, lieu et catégorie sont requis" },
        { status: 400 }
      );
    }

    // Auto-generate property_id (P001, P002...)
    const { count, error: countError } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("Count error:", countError);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }

    const nextId = (count || 0) + 1;
    const propertyId = `P${String(nextId).padStart(3, "0")}`;

    const { data, error } = await supabase
      .from("properties")
      .insert({
        name,
        location,
        description: description || "",
        rooms: rooms || 0,
        bedrooms: bedrooms || 0,
        bathrooms: bathrooms || 0,
        surface: surface || 0,
        price: String(price || "0"),
        type: type || null,
        parking: parking || 0,
        property_id: propertyId,
        category: category.toLowerCase(),
        images: images || null,
        visible_from: visible_from || null,
        nearby_visits: nearby_visits || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "Erreur lors de la création du bien", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data, propertyId },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
