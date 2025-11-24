"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";

type ChartBarData = { name: string; progres: number };
type RadarData = { subject: string; value: number };

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <p className="font-bold text-foreground">{label}</p>
      <p className="text-sm text-primary">Progres: {payload[0].value}%</p>
    </div>
  );
}

export function BarProgressChart({ data }: { data: ChartBarData[] }) {
  if (!data?.length) return <p className="text-sm text-muted-foreground text-center py-10">Nu există date încă.</p>;
  return (
    <div role="img" aria-label="Grafic cu bare al progresului pe materii">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.85} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <RechartsTooltip cursor={{ fill: 'hsl(var(--accent))' }} content={<CustomTooltip />} />
          <Bar dataKey="progres" fill="url(#colorUv)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RadarProgressChart({ data }: { data: RadarData[] }) {
  if (!data?.length) return <p className="text-sm text-muted-foreground text-center py-10">Nu există date încă.</p>;
  return (
    <div role="img" aria-label="Grafic radar al punctelor forte">
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" />
          <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
          <Radar name="Progres" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
