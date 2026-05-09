'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {
  motion,
  useScroll,
  useSpring,
} from 'framer-motion';

import {
  Sparkles,
  Rocket,
  ArrowRight,
  Zap,
  Lock,
  Star,
  BrainCircuit,
  ChevronRight,
  GraduationCap,
  RotateCcw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import CustomCursor from '@/components/animations/CustomCursor';
import { ConfettiButton } from '@/components/animations/confetti-button';
import HeartRating from '@/components/HeartRating';
import InteractiveHeroIllustration from '@/components/animations/InteractiveHeroIllustration';

/* ---------------- ANIMATIONS ---------------- */

const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ---------------- MAIN ---------------- */

export default function Home() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">

      {/* CURSOR */}
      <CustomCursor />

      {/* PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[9999] h-[3px] origin-left bg-primary"
        style={{ scaleX }}
      />

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-50 overflow-hidden">

        {/* base */}
        <div className="absolute inset-0 bg-background" />

        {/* glow 1 */}
        <div
          className="
            absolute
            left-1/2
            top-0
            h-[700px]
            w-[700px]
            -translate-x-1/2
            rounded-full
            bg-primary/10
            blur-[140px]
          "
        />

        {/* glow 2 */}
        <div
          className="
            absolute
            bottom-0
            right-0
            h-[500px]
            w-[500px]
            rounded-full
            bg-blue-500/10
            blur-[120px]
          "
        />

        {/* grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.04]
            [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
            [background-size:60px_60px]
          "
        />
      </div>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 px-6 overflow-hidden">

        <div className="container mx-auto relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
              }}
              className="text-center lg:text-left"
            >

              {/* badge */}
              <motion.div
                variants={fadeInUp}
                className="
                  mb-8
                  inline-flex
                  items-center
                  gap-2
                  px-6
                  py-3
                  rounded-full
                  border
                  border-primary/20
                  bg-white/[0.03]
                  backdrop-blur-xl
                "
              >
                <Sparkles className="w-4 h-4 text-primary" />

                <span
                  className="
                    text-[11px]
                    font-black
                    uppercase
                    tracking-[0.5em]
                    text-primary
                  "
                >
                  Platformă Next-Gen
                </span>
              </motion.div>

              {/* title */}
              <motion.h1
                variants={fadeInUp}
                className="
                  text-6xl
                  sm:text-7xl
                  md:text-8xl
                  lg:text-[9rem]
                  font-black
                  tracking-[-0.08em]
                  leading-[0.85]
                  uppercase
                "
              >
                <span
                  className="
                    bg-gradient-to-b
                    from-foreground
                    via-foreground
                    to-foreground/30
                    bg-clip-text
                    text-transparent
                  "
                >
                  Învață
                </span>

                <br />

                <span
                  className="
                    italic
                    bg-gradient-to-r
                    from-primary
                    via-blue-400
                    to-purple-400
                    bg-clip-text
                    text-transparent
                  "
                >
                  Inteligent.
                </span>
              </motion.h1>

              {/* description */}
              <motion.p
                variants={fadeInUp}
                className="
                  text-lg
                  md:text-2xl
                  text-muted-foreground
                  max-w-2xl
                  mx-auto
                  lg:mx-0
                  mt-10
                  mb-12
                  leading-relaxed
                "
              >
                Am luat materia de la școală și am transformat-o în
                experiențe interactive moderne. Fără haos. Fără timp
                pierdut. Doar progres real.
              </motion.p>

              {/* buttons */}
              <motion.div
                variants={fadeInUp}
                className="
                  flex
                  flex-col
                  sm:flex-row
                  justify-center
                  lg:justify-start
                  gap-6
                "
              >

                {/* primary */}
                <Button
                  asChild
                  size="lg"
                  className="
                    group
                    relative
                    overflow-hidden
                    h-20
                    px-12
                    rounded-full
                    text-xl
                    font-black
                    uppercase
                    tracking-tight
                    shadow-[0_0_60px_rgba(99,102,241,0.35)]
                  "
                >
                  <Link href="/register">

                    <div
                      className="
                        absolute
                        inset-0
                        -translate-x-full
                        bg-gradient-to-r
                        from-transparent
                        via-white/30
                        to-transparent
                        transition-transform
                        duration-1000
                        group-hover:translate-x-full
                      "
                    />

                    <span className="relative z-10 flex items-center">
                      Începe Acum
                      <Rocket className="ml-3 w-6 h-6" />
                    </span>
                  </Link>
                </Button>

                {/* secondary */}
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="
                    h-20
                    px-12
                    rounded-full
                    text-xl
                    font-black
                    uppercase
                    border-primary/20
                    bg-white/[0.03]
                    backdrop-blur-xl
                    hover:bg-primary/10
                    transition-all
                  "
                >
                  <Link href="/#materii">
                    Materii
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* RIGHT */}
            <div className="hidden lg:flex items-center justify-center relative">

              {/* glow */}
              <div
                className="
                  absolute
                  h-[500px]
                  w-[500px]
                  rounded-full
                  bg-primary/20
                  blur-[120px]
                "
              />

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 1,
                }}
                className="relative z-10 scale-110"
              >
                <InteractiveHeroIllustration />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        className="
          py-32
          border-y
          border-border/30
          relative
          z-10
        "
      >
        <div className="container mx-auto px-6">

          {/* header */}
          <div className="text-center mb-20">

            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.5em]
                text-primary
                mb-5
              "
            >
              Avantaje
            </p>

            <h2
              className="
                text-5xl
                md:text-7xl
                font-black
                tracking-[-0.06em]
                uppercase
              "
            >
              De ce suntem diferiți?
            </h2>
          </div>

          {/* cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {[
              {
                icon: BrainCircuit,
                title: 'Logică',
                desc: 'Înțelegi mecanismul din spatele exercițiilor, nu doar formulele.',
              },
              {
                icon: Zap,
                title: 'Rapiditate',
                desc: 'Lecții optimizate pentru a învăța mai mult în mai puțin timp.',
              },
              {
                icon: Star,
                title: 'Interactiv',
                desc: 'Quiz-uri, progres și experiențe create să te țină concentrat.',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                }}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[3rem]
                  border
                  border-white/10
                  bg-white/[0.03]
                  backdrop-blur-2xl
                  p-12
                "
              >

                {/* hover glow */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-br
                    from-white/[0.07]
                    to-transparent
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-500
                  "
                />

                <card.icon className="w-16 h-16 text-primary mb-8 relative z-10" />

                <h3
                  className="
                    text-4xl
                    font-black
                    uppercase
                    tracking-[-0.05em]
                    mb-5
                    relative
                    z-10
                  "
                >
                  {card.title}
                </h3>

                <p
                  className="
                    text-lg
                    leading-relaxed
                    text-muted-foreground
                    relative
                    z-10
                  "
                >
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBJECTS */}
      <section
        id="materii"
        className="py-32 relative z-10"
      >
        <div className="container mx-auto px-6">

          {/* title */}
          <div className="mb-24">

            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.5em]
                text-primary
                mb-5
              "
            >
              Educație
            </p>

            <h2
              className="
                text-6xl
                md:text-[9rem]
                font-black
                uppercase
                tracking-[-0.08em]
              "
            >
              Materii.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* EN */}
            <motion.div
              whileHover={{
                y: -10,
              }}
              className="
                relative
                overflow-hidden
                rounded-[4rem]
                border
                border-white/10
                bg-white/[0.03]
                backdrop-blur-2xl
                p-12
              "
            >

              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />

              <div className="relative z-10">

                <div className="flex items-center gap-4 mb-10">
                  <GraduationCap className="w-8 h-8 text-primary" />

                  <p
                    className="
                      text-sm
                      font-black
                      uppercase
                      tracking-[0.4em]
                      text-primary
                    "
                  >
                    Evaluare Națională
                  </p>
                </div>

                <div className="space-y-4">

                  {[
                    {
                      name: 'Limba Română',
                      link: '/materii/romana',
                    },
                    {
                      name: 'Matematică',
                      link: '/materii/matematica',
                    },
                    {
                      name: 'Informatică',
                      link: '/materii/informatica',
                    },
                    {
                      name: 'Chimie',
                      link: '/materii/chimie',
                    },
                    {
                      name: 'Fizică',
                      link: '/materii/fizica',
                    },
                  ].map((m) => (
                    <Link
                      key={m.name}
                      href={m.link}
                      className="
                        group
                        flex
                        items-center
                        justify-between
                        rounded-2xl
                        border
                        border-white/5
                        bg-white/[0.02]
                        px-8
                        py-6
                        transition-all
                        hover:border-primary/40
                        hover:bg-primary/5
                      "
                    >
                      <span
                        className="
                          text-2xl
                          font-black
                          uppercase
                          tracking-[-0.05em]
                        "
                      >
                        {m.name}
                      </span>

                      <ChevronRight
                        className="
                          transition-transform
                          group-hover:translate-x-2
                        "
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* BAC */}
            <motion.div
              whileHover={{
                y: -10,
              }}
              className="
                relative
                overflow-hidden
                rounded-[4rem]
                border
                border-white/10
                bg-white/[0.03]
                backdrop-blur-2xl
                p-12
              "
            >

              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />

              <div className="relative z-10">

                <div className="flex items-center gap-4 mb-10">
                  <Lock className="w-8 h-8 text-blue-400" />

                  <p
                    className="
                      text-sm
                      font-black
                      uppercase
                      tracking-[0.4em]
                      text-blue-400
                    "
                  >
                    Bacalaureat
                  </p>
                </div>

                <div className="space-y-4">

                  {[
                    'Română',
                    'Matematică',
                    'Informatică',
                    'Chimie',
                    'Fizică',
                  ].map((m) => (
                    <div
                      key={m}
                      className="
                        flex
                        items-center
                        justify-between
                        rounded-2xl
                        border
                        border-white/5
                        bg-white/[0.02]
                        px-8
                        py-6
                        opacity-40
                      "
                    >
                      <span
                        className="
                          text-2xl
                          font-black
                          uppercase
                          tracking-[-0.05em]
                        "
                      >
                        {m}
                      </span>

                      <Lock size={22} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="py-40 container mx-auto px-6 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* image */}
          <div className="flex justify-center relative">

            <div
              className="
                absolute
                h-[500px]
                w-[500px]
                rounded-full
                bg-primary/20
                blur-[140px]
              "
            />

            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              className="
                relative
                w-72
                h-96
                md:w-96
                md:h-[520px]
                rounded-[4rem]
                overflow-hidden
                border
                border-white/10
                bg-white/[0.03]
                shadow-[0_0_60px_rgba(0,0,0,0.5)]
              "
            >
              <Image
                src="/images/SPY.png"
                alt="David"
                fill
                priority
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* text */}
          <div className="text-center lg:text-left">

            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.5em]
                text-primary
                mb-6
              "
            >
              Fondator
            </p>

            <h2
              className="
                text-5xl
                md:text-7xl
                font-black
                uppercase
                leading-[0.9]
                tracking-[-0.07em]
              "
            >
              „Am făcut asta pentru elevi.”
            </h2>

            <p
              className="
                mt-10
                text-xl
                leading-relaxed
                text-muted-foreground
                max-w-2xl
              "
            >
              Sunt Mera Alin David. Am creat această platformă
              pentru că m-am săturat de învățarea haotică și lipsită
              de logică. Vreau ca educația să pară modernă,
              captivantă și clară.
            </p>

            <div className="mt-12">

              <p
                className="
                  text-3xl
                  font-black
                  uppercase
                  tracking-[-0.05em]
                "
              >
                Mera Alin David
              </p>

              <p
                className="
                  mt-2
                  text-xs
                  uppercase
                  tracking-[0.4em]
                  text-muted-foreground
                "
              >
                Founder • Developer
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="pb-40 container mx-auto flex flex-col items-center px-6 relative z-10">

        <div
          className="
            mb-32
            text-center
            space-y-12
            p-16
            md:p-24
            rounded-[5rem]
            border
            border-white/10
            bg-white/[0.03]
            backdrop-blur-2xl
            w-full
            max-w-4xl
            relative
            overflow-hidden
            shadow-[0_0_80px_rgba(0,0,0,0.45)]
          "
        >

          {/* glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />

          <div className="relative z-10">

            <p
              className="
                text-[11px]
                font-black
                uppercase
                tracking-[0.7em]
                text-primary
                opacity-70
              "
            >
              Părerea ta contează
            </p>

            <h3
              className="
                text-4xl
                md:text-7xl
                font-black
                uppercase
                tracking-tighter
                leading-none
              "
            >
              CE NOTĂ NE DAI?
            </h3>

            <div className="flex justify-center py-10 relative">

              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <HeartRating slug="contact-feedback" />
              </motion.div>

              {/* RESET */}
              <button
                onClick={() => {
                  localStorage.removeItem(
                    'heart-rating-contact-feedback'
                  );

                  window.location.reload();
                }}
                className="
                  absolute
                  right-0
                  top-1/2
                  -translate-y-1/2
                  opacity-20
                  hover:opacity-100
                  transition-all
                "
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="relative group">

          <div
            className="
              absolute
              inset-0
              bg-primary/20
              blur-[120px]
              rounded-full
              group-hover:bg-primary/40
              transition-all
              duration-1000
            "
          />

          <ConfettiButton
            asChild
            className="
              w-72
              h-72
              md:w-[450px]
              md:h-[450px]
              rounded-full
              bg-foreground
              text-background
              shadow-[0_0_100px_rgba(255,255,255,0.12)]
              hover:scale-105
              active:scale-95
              transition-transform
              relative
              z-10
            "
          >
            <Link
              href="/register"
              className="
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-12
              "
            >
              <span
                className="
                  text-6xl
                  md:text-8xl
                  font-black
                  tracking-tighter
                  italic
                  uppercase
                  leading-none
                  mb-6
                "
              >
                Înscrie-te.
              </span>

              <span
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.5em]
                  opacity-40
                "
              >
                100% Gratuit. Acum și mereu.
              </span>
            </Link>
          </ConfettiButton>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="
          py-20
          border-t
          border-border/20
          text-center
          opacity-30
          text-[10px]
          font-bold
          uppercase
          tracking-[1em]
        "
      >
        Învățăm Împreună © 2026
      </footer>
    </div>
  );
}