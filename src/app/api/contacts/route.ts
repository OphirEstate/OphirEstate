import { NextRequest, NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function isAuthenticated(request: NextRequest): boolean {
  const session = request.cookies.get("admin_session");
  if (!session || !session.value) return false;

  try {
    const decoded = Buffer.from(session.value, "base64").toString("utf-8");
    const parts = decoded.split(":");
    const timestamp = parts[parts.length - 1];
    const sessionAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000;
    return sessionAge <= maxAge;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const res = await supabaseRest("contact_submissions?select=*&order=created_at.desc");
    const rawData = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: "Erreur lors de la récupération des contacts" }, { status: 500 });
    }

    const mappedData = (rawData || []).map((row: Record<string, unknown>) => ({
      id: row.id,
      documentId: row.document_id,
      fullName: row.full_name,
      Email: row.email,
      Country: row.country,
      Subject: row.subject,
      Message: row.message,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ data: mappedData }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
