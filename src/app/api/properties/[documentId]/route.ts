import { NextRequest, NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function getDevRole(request: NextRequest): boolean {
  const session = request.cookies.get("admin_session");
  if (!session?.value) return false;

  try {
    const decoded = Buffer.from(session.value, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length === 3 && parts[1] === "dev") {
      const sessionAge = Date.now() - parseInt(parts[2]);
      return sessionAge <= 24 * 60 * 60 * 1000;
    }
    return false;
  } catch {
    return false;
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  if (!getDevRole(request)) {
    return NextResponse.json({ error: "Accès réservé aux développeurs" }, { status: 403 });
  }

  const { documentId } = params;

  try {
    const body = await request.json();
    const {
      name, location, description, rooms, bedrooms, bathrooms,
      surface, surface_unit, price, type, parking, category, images,
      visible_from, nearby_visits, views, visible,
    } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (description !== undefined) updateData.description = description;
    if (rooms !== undefined) updateData.rooms = rooms;
    if (bedrooms !== undefined) updateData.bedrooms = bedrooms;
    if (bathrooms !== undefined) updateData.bathrooms = bathrooms;
    if (surface !== undefined) updateData.surface = surface;
    if (surface_unit !== undefined) updateData.surface_unit = surface_unit;
    if (price !== undefined) updateData.price = String(price);
    if (type !== undefined) updateData.type = type;
    if (parking !== undefined) updateData.parking = parking;
    if (category !== undefined) updateData.category = category.toLowerCase();
    if (images !== undefined) updateData.images = images;
    if (visible_from !== undefined) updateData.visible_from = visible_from || null;
    if (nearby_visits !== undefined) updateData.nearby_visits = nearby_visits || null;
    if (views !== undefined) updateData.views = views;
    if (visible !== undefined) updateData.visible = visible;

    const res = await supabaseRest(
      `properties?document_id=eq.${documentId}`,
      {
        method: "PATCH",
        body: JSON.stringify(updateData),
        headers: { "Prefer": "return=representation" },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: "Erreur lors de la modification", details: JSON.stringify(data) },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  if (!getDevRole(request)) {
    return NextResponse.json({ error: "Accès réservé aux développeurs" }, { status: 403 });
  }

  const { documentId } = params;

  try {
    const res = await supabaseRest(
      `properties?document_id=eq.${documentId}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Bien supprimé" }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
