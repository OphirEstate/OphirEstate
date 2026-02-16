import { NextRequest, NextResponse } from "next/server";

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

    // Direct REST API call instead of client library
    const res = await fetch(
      `${url}/rest/v1/contact_submissions?select=*&order=created_at.desc`,
      {
        headers: {
          "apikey": key!,
          "Authorization": `Bearer ${key}`,
        },
        cache: "no-store",
      }
    );

    const rawData = await res.json();

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

    return NextResponse.json({
      data: mappedData,
      _debug: {
        count: rawData?.length || 0,
        restStatus: res.status,
        urlPrefix: url?.substring(0, 30),
        keyPrefix: key?.substring(0, 20),
      },
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(error) },
      { status: 500 }
    );
  }
}
