import { NextRequest, NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, Email, Country, Subject, Message } = body;

    if (!fullName || !Email || !Country || !Subject || !Message) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const res = await supabaseRest("contact_submissions", {
      method: "POST",
      body: JSON.stringify({
        full_name: fullName,
        email: Email,
        country: Country,
        subject: Subject,
        message: Message,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Supabase error:", data);
      return NextResponse.json({ error: "Erreur lors de l'envoi du message" }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, message: "Message envoyé avec succès", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
