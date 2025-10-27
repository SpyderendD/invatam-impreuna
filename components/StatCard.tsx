// app/profil/components/StatCard.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function StatCard({ icon, title, description, children }: StatCardProps) {
  return (
    // Card-ul principal rămâne un container flexibil vertical
    <Card className="flex flex-col p-6 h-full bg-card/50">
      
      {/* Partea de sus: Titlu și descriere (neschimbat) */}
      <CardHeader className="p-0">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">{icon}</span>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>
        <CardDescription className="pt-1">{description}</CardDescription>
      </CardHeader>
      
      {/* 
        Partea de jos: Conținutul.
        --- MODIFICAREA CHEIE AICI ---
        - `mt-auto` (margin-top: auto) va împinge acest div în partea de jos
          a containerului flexibil părinte.
        - `w-full` asigură că ocupă toată lățimea pentru o centrare corectă.
      */}
      <CardContent className="p-0 mt-auto w-full">
        <div className="flex flex-col items-center">
            {children}
        </div>
      </CardContent>

    </Card>
  );
}