'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, Mail } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-12">
        <div className="w-full rounded-3xl border bg-card p-6 shadow-sm sm:p-10">
          <div className="text-center">
            <h1 className="text-6xl font-black tracking-tight md:text-7xl">--Eroare 404--</h1>
            <p className="mt-3 text-lg sm:text-xl text-muted-foreground">
              Ups! Pagina aceasta nu există. Hai înapoi la învățare.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <BearHoldingBook />
          </div>

          <div className="mt-10 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Înapoi acasă
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/#materii">
                <BookOpen className="mr-2 h-5 w-5" />
                Continuă să înveți
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full sm:w-auto">
              <Link href="/contact">
                <Mail className="mr-2 h-5 w-5" />
                Raporteaza o problemă
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}


function BearHoldingBook() {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 320 260"
        className="h-[340px] w-[340px] select-none"
        role="img"
        aria-label="Ursuleț care ține o carte 3D cu paginile spre el"
      >
        <defs>
          <clipPath id="eyeClipL"><circle cx="150" cy="110" r="10" /></clipPath>
          <clipPath id="eyeClipR"><circle cx="182" cy="110" r="10" /></clipPath>

          <radialGradient id="furGrad" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#efc49e" />
            <stop offset="100%" stopColor="#e2ab80" />
          </radialGradient>
          <radialGradient id="snoutGrad" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#fff1e6" />
            <stop offset="100%" stopColor="#ffe2d0" />
          </radialGradient>
        </defs>

        {/* Umbre puffy */}
        <ellipse cx="166" cy="230" rx="68" ry="16" className="shadow-dark" />
        <ellipse cx="166" cy="238" rx="60" ry="10" className="shadow-soft" />

        {/* Ursuleț */}
        <g className="float">
          {/* Urechi */}
          <g className="ears">
            <circle cx="128" cy="72" r="20" className="fur" />
            <circle cx="204" cy="72" r="20" className="fur" />
          </g>

          {/* Cap + corp */}
          <circle cx="166" cy="112" r="48" className="fur" />
          <ellipse cx="166" cy="178" rx="56" ry="58" className="fur breathe" />

          {/* Botic + nas + zâmbet */}
          <g>
            <ellipse cx="166" cy="132" rx="24" ry="18" className="snout" />
            <ellipse cx="166" cy="129.5" rx="7" ry="5" className="nose" />
            <path d="M156 140 q10 9 20 0" className="mouth" />
          </g>

          {/* Ochi + pleoape (blink simultan) */}
          <g>
            <g clipPath="url(#eyeClipL)">
              <circle cx="150" cy="110" r="10" fill="#fff" />
              <circle cx="150" cy="111" r="5.6" fill="#6b4f3e" />
              <circle cx="149" cy="110" r="2.6" fill="#1f1f1f" />
              <circle cx="147.9" cy="108.6" r="1.4" fill="#fff" />
              <rect x="140" y="100" width="20" height="20" rx="10" className="lid" />
            </g>
            <g clipPath="url(#eyeClipR)">
              <circle cx="182" cy="110" r="10" fill="#fff" />
              <circle cx="182" cy="111" r="5.6" fill="#6b4f3e" />
              <circle cx="181" cy="110" r="2.6" fill="#1f1f1f" />
              <circle cx="179.9" cy="108.6" r="1.4" fill="#fff" />
              <rect x="172" y="100" width="20" height="20" rx="10" className="lid" />
            </g>
          </g>

          {/* Obraji */}
          <g opacity=".22">
            <circle cx="146" cy="142" r="8" className="blush" />
            <circle cx="186" cy="142" r="8" className="blush" />
          </g>

          {/* Picioare cu pernuțe */}
          <g className="legs">
            <g transform="translate(130,214) rotate(-14)">
              <ellipse cx="0" cy="0" rx="30" ry="20" className="fur-light" />
              <ellipse cx="3" cy="3" rx="13" ry="9.5" className="pad" />
              <circle cx="-10.5" cy="-1" r="4" className="pad" />
              <circle cx="1" cy="-5" r="3.4" className="pad" />
              <circle cx="12" cy="-1" r="4" className="pad" />
            </g>
            <g transform="translate(202,214) rotate(14)">
              <ellipse cx="0" cy="0" rx="30" ry="20" className="fur-light" />
              <ellipse cx="-3" cy="3" rx="13" ry="9.5" className="pad" />
              <circle cx="-12" cy="-1" r="4" className="pad" />
              <circle cx="-1" cy="-5" r="3.4" className="pad" />
              <circle cx="10" cy="-1" r="4" className="pad" />
            </g>
          </g>

          {/* BOOK RIG = carte + mâini (un singur transform stabilește poziția) */}
          <g
            className="bookRig bookRig-position"
          >
            {/* Cartea 3D: vedem coperțile, paginile sunt spre urs */}
            <g className="book3d">
              {/* “Top pages” – fâșie pagini vizibile de sus */}
              <polygon points="-10,-30 10,-30 8,-26 -8,-26" className="pagesTop" />
              <g className="edgeLines">
                <line x1="-8" y1="-28" x2="8" y2="-28" />
                <line x1="-7" y1="-27" x2="7" y2="-27" />
              </g>

              {/* cotor gros + highlight */}
              <polygon points="-10,-30 10,-30 14,20 -14,20" className="spineFace" />
              <rect x="-1" y="-30" width="2" height="50" rx="1" className="spineHighlight" />

              {/* copertă stânga + cant */}
              <polygon points="-90,-30 -10,-30 -14,20 -94,20" className="coverFace left" />
              <polygon points="-94,20 -14,20 -14,24 -94,24" className="coverEdge" />

              {/* copertă dreapta + cant */}
              <polygon points="10,-30 90,-30 94,20 14,20" className="coverFace right" />
              <polygon points="14,20 94,20 94,24 14,24" className="coverEdge" />

              {/* luciu pe coperta dreaptă */}
              <path d="M36,-22 q24,10 20,26 q-18,12 -32,8 z" className="coverGloss" />

              {/* “tab” de pagină – flip rar */}
              <path d="M10,-30 q16,6 14,18 q-12,0 -14,-10 z" className="pageTab" />
            </g>

            {/* MÂINILE – poziționate relativ la carte (țin marginile) */}
            <g className="hands">
              {/* stânga: chiar pe muchia coperta stângă */}
              <g transform="translate(-100,-4)">
                <ellipse cx="0" cy="0" rx="16" ry="12" className="fur" />
                <circle cx="-6" cy="-2" r="2.2" className="pad" />
                <circle cx="-1" cy="-3.2" r="2.2" className="pad" />
                <circle cx="4" cy="-2" r="2.2" className="pad" />
              </g>
              {/* dreapta */}
              <g transform="translate(100,-4)">
                <ellipse cx="0" cy="0" rx="16" ry="12" className="fur" />
                <circle cx="-4" cy="-2" r="2.2" className="pad" />
                <circle cx="1" cy="-3.2" r="2.2" className="pad" />
                <circle cx="6" cy="-2" r="2.2" className="pad" />
              </g>
            </g>
          </g>
          {/* end BOOK RIG */}
        </g>
      </svg>

      <style jsx>{`
        /* Poziționare carte pe piept */
        .bookRig-position { transform: translate(166px, 178px); }

        /* Blăniță cu gradient ușor (mai 3D) */
        .fur { fill: url(#furGrad); }
        .fur-light { fill: #f0c9a6; }
        .nose { fill: #6d5448; }
        .mouth { fill: none; stroke: #6d5448; stroke-width: 2.2; stroke-linecap: round; }
        :global(.dark) .nose { fill: #eee2dc; }
        :global(.dark) .mouth { stroke: #eee2dc; }

        .blush { fill: #ff9fb2; }
        .pad { fill: #ffa9b7; }
        .shadow-dark { fill: rgba(0,0,0,.75); }
        .shadow-soft { fill: rgba(120,130,150,.25); }

        /* Cartea 3D (pagini spre urs): coperți = primary */
        .bookRig { transform-box: fill-box; transform-origin: center; } /* UN singur transform (inline) */
        .book3d { color: hsl(var(--primary)); }
        .coverFace { fill: currentColor; }
        .coverEdge { fill: color-mix(in srgb, currentColor 70%, black 30%); opacity: .35; }
        .spineFace { fill: color-mix(in srgb, currentColor 55%, black 45%); opacity: .45; }
        .spineHighlight { fill: #ffffff99; }
        .pagesTop { fill: #fff6ea; }
        .edgeLines line { stroke: #eddcc7; stroke-width: 1; stroke-linecap: round; opacity: .9; }
        .coverGloss { fill: #ffffff55; }
        .pageTab { fill: #fff; opacity: .9; transform-origin: 10px -30px; animation: tabFlip 9.5s ease-in-out infinite; }

        /* Animații fine */
        .float { animation: float 6s ease-in-out infinite; transform-origin: 50% 50%; }
        .breathe { animation: breathe 3.8s ease-in-out infinite; transform-origin: 50% 72%; }
        .ears { animation: ears 5s ease-in-out infinite; transform-origin: 50% 40%; }

        .lid {
          fill: #e2ab80;
          transform-box: fill-box;
          transform-origin: 50% 0%;
          animation: eyelid 6.4s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(-6px); }
          50% { transform: translateY(6px); }
          100% { transform: translateY(-6px); }
        }
        @keyframes breathe {
          0% { transform: scale(1); }
          50% { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        @keyframes ears {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(2.2deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes eyelid {
          0%, 92%, 100% { transform: scaleY(0); }
          95% { transform: scaleY(1); }
        }
        @keyframes tabFlip {
          0%, 46%, 54%, 100% { transform: rotate(0deg) translateY(0); opacity: .9; }
          50% { transform: rotate(-18deg) translateY(-2px); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .float, .breathe, .ears, .lid, .pageTab { animation: none !important; }
        }
      `}</style>
    </div>
  );
}