


// ///.UPDATED:


import { NextResponse } from "next/server";

// ENV VARIABLES
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

// APPROVED TEMPLATE DETAILS
const TEMPLATE_NAME = "patient_prescription_v"; // 7 variables
const LANGUAGE_CODE = "en"; // must EXACTLY match Meta template language

// Incoming data from Add-Patient page
interface PrescriptionData {
  name: string;          // {{1}}
  mobile: string;        // {{2}}
  age?: number | string; // {{3}}
  address?: string;      // {{4}}
  medicines: string;     // {{5}}
  suggestion?: string;  // {{6}}
  doseNotes?: string;   // {{7}}
}

export async function POST(request: Request) {
  // ---- ENV VALIDATION ----
  if (!WHATSAPP_ACCESS_TOKEN || !PHONE_NUMBER_ID) {
    return NextResponse.json(
      { error: "WhatsApp configuration missing" },
      { status: 500 }
    );
  }

  try {
    const body: PrescriptionData = await request.json();

    const {
      name,
      mobile,
      age,
      address,
      medicines,
      suggestion,
      doseNotes,
    } = body;

    // ---- BASIC VALIDATION ----
    if (!name || !mobile) {
      return NextResponse.json(
        { error: "Name or mobile missing" },
        { status: 400 }
      );
    }

    // ---- MOBILE SANITIZATION (INDIA) ----
    let recipientMobile = mobile.replace(/[^0-9]/g, "");
    if (!recipientMobile.startsWith("91")) {
      recipientMobile = "91" + recipientMobile;
    }

    const apiUrl = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;

    // ---- DEBUG LOG (VERY IMPORTANT) ----
    console.log("WhatsApp template used:", TEMPLATE_NAME);
    console.log("WhatsApp recipient:", recipientMobile);

    // ---- TEMPLATE PAYLOAD ----
    const messagePayload = {
      messaging_product: "whatsapp",
      to: recipientMobile,
      type: "template",
      template: {
        name: TEMPLATE_NAME,
        language: { code: LANGUAGE_CODE },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: name },
              { type: "text", text: recipientMobile },
              { type: "text", text: age ? age.toString() : "N/A" },
              { type: "text", text: address || "N/A" },
              { type: "text", text: medicines || "N/A" },
              { type: "text", text: suggestion || "N/A" },
              { type: "text", text: doseNotes || "N/A" },
            ],
          },
        ],
      },
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagePayload),
    });

    const data = await response.json();

    // ---- META ERROR HANDLING ----
    if (!response.ok) {
      console.error("WhatsApp API error:", data);
      return NextResponse.json(
        { error: "WhatsApp send failed", details: data },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "WhatsApp sent successfully", response: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
