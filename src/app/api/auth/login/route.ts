import { NextRequest, NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getCredentialsByEmail(email: string) {
  const res = await supabaseRest(
    `admin_credentials?select=email,password,role&email=eq.${encodeURIComponent(email)}`
  );
  const data = await res.json();

  if (!res.ok || !Array.isArray(data) || data.length === 0) return null;
  return { email: data[0].email, password: data[0].password, role: data[0].role as string };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    const credentials = await getCredentialsByEmail(email);

    if (!credentials || email !== credentials.email || password !== credentials.password) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const token = Buffer.from(`${email}:${credentials.role}:${Date.now()}`).toString("base64");

    const response = NextResponse.json(
      { success: true, message: "Connexion réussie", role: credentials.role },
      { status: 200 }
    );

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
