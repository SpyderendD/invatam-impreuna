// app/profil/components/StatCard.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// --- Am SCOS importul `motion` și `itemVariants` de aici ---

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

// --- Componenta NU mai folosește `motion.div` ---
export function StatCard({ icon, title, description, children }: StatCardProps) {
  return (
    <Card className="flex flex-col p-6 h-full bg-card/50">
      <CardHeader className="p-0">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">{icon}</span>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>
        <CardDescription className="pt-1">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex flex-col flex-grow justify-center lg:justify-end items-center mt-4">
        {children}
      </CardContent>
    </Card>
  );
}