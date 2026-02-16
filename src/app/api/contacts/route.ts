import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return NextResponse.json(
        { error: "Config manquante", hasUrl: !!url, hasKey: !!key },
        { status: 500 }
      );
    }

    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Erreur Supabase", details: error.message, code: error.code },
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

    return NextResponse.json({ data: mappedData, _debug: { count: data?.length || 0 } }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(error) },
      { status: 500 }
    );
  }
}
