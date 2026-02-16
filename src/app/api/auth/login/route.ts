import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

async function getCredentialsByEmail(email: string) {
  const { data, error } = await supabase
    .from("admin_credentials")
    .select("email, password, role")
    .eq("email", email)
    .single();

  if (error || !data) return null;
  return { email: data.email, password: data.password, role: data.role as string };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const credentials = await getCredentialsByEmail(email);

    if (!credentials || email !== credentials.email || password !== credentials.password) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
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
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
