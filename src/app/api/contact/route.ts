import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, Email, Country, Subject, Message } = body;

    // Validation
    if (!fullName || !Email || !Country || !Subject || !Message) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      );
    }

    // Send to Strapi
    const response = await fetch(`${STRAPI_URL}/api/contact-submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          fullName,
          Email,
          Country,
          Subject,
          Message,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Strapi error:", errorData);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi du message" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(
      { success: true, message: "Message envoyé avec succès", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
