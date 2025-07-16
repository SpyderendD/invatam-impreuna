// src/app/api/newsletter/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Email invalid.' }, { status: 400 });
        }

        // AICI VOM APELA API-UL BREVO
        const BREVO_API_KEY = process.env.BREVO_API_KEY;
        const BREVO_LIST_ID = 3; // <<< ATENȚIE: ÎNLOCUIEȘTE CU ID-ul LISTEI TALE BREVO

        if (!BREVO_API_KEY) {
            console.error("BREVO_API_KEY nu este definit în variabilele de mediu.");
            return NextResponse.json({ error: 'Configurare server incorectă.' }, { status: 500 });
        }

        const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': BREVO_API_KEY,
            },
            body: JSON.stringify({
                email: email,
                listIds: [BREVO_LIST_ID], // Adaugă contactul la lista specificată
                // emailBlacklisted: false, // Poți adăuga și alte atribute dacă vrei
                // smsBlacklisted: false,
                 updateEnabled: true // Permite actualizarea contactelor existente
            }),
        });

        if (!brevoResponse.ok) {
            const errorData = await brevoResponse.json();
            console.error('Brevo API Error:', errorData);
            throw new Error(errorData.message || 'Eroare la abonare la newsletter.');
        }

        console.log(`Email ${email} abonat cu succes la Brevo.`);
        return NextResponse.json({ message: 'Abonare la newsletter reușită!' });

    } catch (error: any) {
        console.error("Eroare la abonarea la newsletter (server-side):", error);
        return NextResponse.json({ error: error.message || 'Eroare la abonare.' }, { status: 500 });
    }
}