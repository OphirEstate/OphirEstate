import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des contacts" },
        { status: 500 }
      );
    }

    const mappedData = (data || []).map((row) => ({
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
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
