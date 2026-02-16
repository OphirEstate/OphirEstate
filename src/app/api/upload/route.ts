import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function isAuthenticated(request: NextRequest): boolean {
  const session = request.cookies.get("admin_session");
  if (!session?.value) return false;

  try {
    const decoded = Buffer.from(session.value, "base64").toString("utf-8");
    const parts = decoded.split(":");
    const timestamp = parts[parts.length - 1];
    const sessionAge = Date.now() - parseInt(timestamp);
    return sessionAge <= 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    const uploadedFilenames: string[] = [];

    for (const file of files) {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filename = `${timestamp}-${safeName}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const res = await fetch(
        `${url}/storage/v1/object/property-images/${filename}`,
        {
          method: "POST",
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`,
            "Content-Type": file.type,
          },
          body: buffer,
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error("Upload error:", err);
        return NextResponse.json(
          { error: `Erreur lors de l'upload de ${file.name}` },
          { status: 500 }
        );
      }

      uploadedFilenames.push(filename);
    }

    return NextResponse.json(
      { success: true, filenames: uploadedFilenames },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
