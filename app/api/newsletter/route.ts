import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, name } = await req.json(); // Citim și numele

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Email invalid.' }, { status: 400 });
  }

  // Verificăm dacă avem cheia API
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
          FIRSTNAME: name, // Aici trimitem numele către Brevo
          // Poți adăuga și LASTNAME dacă vrei, dar FIRSTNAME e destul
        },
        listIds: [2], // Asigură-te că ID-ul listei e corect (2 e cel standard de obicei)
        updateEnabled: true // Dacă există deja, îi face update la nume
      }),
    });

    if (!response.ok) {
        // Dacă eroarea e că există deja, nu e neapărat o eroare gravă, dar Brevo returnează eroare la duplicate fără updateEnabled
        const errorData = await response.json();
        // Codul 'duplicate_parameter' înseamnă că e deja abonat
        if (errorData.code === 'duplicate_parameter') {
             return NextResponse.json({ message: 'Ești deja abonat!' }, { status: 200 });
        }
        return NextResponse.json({ error: 'Eroare la Brevo.' }, { status: response.status });
    }

    return NextResponse.json({ message: 'Te-ai abonat cu succes!' }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'Eroare de server.' }, { status: 500 });
  }
}