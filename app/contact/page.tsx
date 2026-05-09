import type { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import { ParticlesBackground } from '@/components/animations/ParticlesBackground';

export const metadata: Metadata = {
  title: 'Contact & Povestea mea',
  description: 'Află povestea din spatele platformei Învățam Împreună și contactează-ne. Un proiect născut din pasiune, pentru elevi.',
};

export default function ContactPage() {
  return (
    <>
      <ParticlesBackground />
      <ContactForm />
    </>
  );
  
}