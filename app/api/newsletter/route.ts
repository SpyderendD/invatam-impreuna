import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, name } = await req.json();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Email invalid.' }, { status: 400 });
  }

  const API_KEY = process.env.BREVO_API_KEY;
  if (!API_KEY) {
    return NextResponse.json({ error: 'Server misconfigured.' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
        'accept': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          FIRSTNAME: name,
        },
        // --- AICI ESTE SCHIMBAREA IMPORTANTĂ ---
        // Schimbăm ID-ul listei în 3, pentru a se potrivi cu automatizarea ta
        listIds: [3], 
        // ---------------------------------------
        updateEnabled: true 
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        // Dacă contactul există deja, încercăm să-l adăugăm forțat în lista 3
        if (errorData.code === 'duplicate_parameter') {
             // Facem un nou call pentru a adăuga contactul existent în lista 3
             // Dar pentru simplitate, mesajul de "deja abonat" e ok de obicei.
             // Dacă vrei să forțezi adăugarea în listă pentru cei existenți, e nevoie de logică extra.
             return NextResponse.json({ message: 'Ești deja abonat!' }, { status: 200 });
        }
        return NextResponse.json({ error: 'Eroare la Brevo.' }, { status: response.status });
    }

    return NextResponse.json({ message: 'Te-ai abonat cu succes!' }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'Eroare de server.' }, { status: 500 });
  }
}