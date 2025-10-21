// app/profil/components/StatCard.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function StatCard({ icon, title, description, children }: StatCardProps) {
  return (
    <motion.div variants={itemVariants}>
      {/*
        MODIFICARE:
        - Am scos `min-h-[260px]` pentru a permite cardului să aibă o înălțime naturală.
        - Am păstrat `h-full` pentru a se întinde pe toată înălțimea rândului din grid.
      */}
      <Card className="flex flex-col p-6 h-full bg-card/50">
        
        {/* Partea de sus: Titlu și descriere */}
        <CardHeader className="p-0">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">{icon}</span>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          <CardDescription className="pt-1">{description}</CardDescription>
        </CardHeader>
        
        {/* 
          Partea de jos: Conținutul (inelul sau badge-ul).
          MODIFICARE: `justify-end` devine `justify-center` pe mobil/tabletă și `justify-end` pe desktop.
          Acest lucru asigură o aliniere mai bună pe ecrane mici.
        */}
        <CardContent className="p-0 flex flex-col flex-grow justify-center lg:justify-end items-center mt-4">
          {children}
        </CardContent>

      </Card>
    </motion.div>
  );
}