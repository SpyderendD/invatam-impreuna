// components/blog/VideoBlogPage.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';

// --- Tipuri de date pentru a lucra mai ușor ---
interface YouTubeVideo {
  id: { videoId: string };
  snippet: { title: string };
}

// --- Componenta principală ---
export default function VideoBlogPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestVideos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Apelăm propriul nostru API, care rulează pe server
      const response = await fetch('/api/youtube'); 
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'A apărut o eroare la preluarea datelor de pe server.');
      }
      
      setVideos(data.items || []);

      if (!data.items || data.items.length === 0) {
        setError("Momentan, nu există videouri noi pe acest canal sau nu au putut fi încărcate.");
      }

    } catch (err: any) {
      console.error("Eroare la preluarea videourilor:", err);
      setError(`A apărut o problemă la încărcarea videourilor: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestVideos();
  }, [fetchLatestVideos]);

  // Funcție pentru a adăuga clasa specifică la body la montare și a o scoate la demontare
  useEffect(() => {
    document.body.classList.add('blog-page-styles');
    return () => {
      document.body.classList.remove('blog-page-styles');
    };
  }, []);

  return (
    <>
      <Head>
        <title>Spyderend | Resurse Video Educative</title>
        <meta name="description" content="Explorează cele mai recente resurse video educative de pe canalul Spyderend pentru a te pregăti pentru succes." />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>" />
      </Head>

      <style jsx global>{`
        /* CSS-ul tău, aplicat global dar condiționat de clasa .blog-page-styles */
        .blog-page-styles {
          --primary-color: #0056b3;
          --secondary-color: #007BFF;
          --accent-color: #ffc107;
          
          --bg-main: #f4f6f9;
          --content-bg: #FFFFFF;
          --text-headings: #1f2937;
          --text-body: #374151;
          --text-muted: #6b7280;
          --border-light: #e5e7eb;
          --border-medium: #d1d5db;
  
          --border-radius-sm: 4px;
          --border-radius-card: 10px;
          --border-radius-button: 6px;
  
          --shadow-subtle: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
          --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.08);
          --shadow-hover: 0 8px 16px rgba(0, 0, 0, 0.1);
          --shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05);
          --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
  
          --font-heading: 'Poppins', sans-serif;
          --font-body: 'Roboto', sans-serif;
          
          --transition-main: 0.25s ease-in-out;
        }
  
        .blog-page-styles *, .blog-page-styles *::before, .blog-page-styles *::after { box-sizing: border-box; }
        
        .blog-page-styles {
          font-family: var(--font-body);
          line-height: 1.65;
          background-color: var(--bg-main);
          color: var(--text-body);
        }
  
        .page-wrapper { width: 100%; display: flex; flex-direction: column; min-height: 100vh; }
  
        .container {
          width: calc(100% - 2rem);
          max-width: 1100px;
          margin: 2rem auto;
          padding: 1.5rem;
          background: var(--content-bg);
          border-radius: var(--border-radius-card);
          box-shadow: var(--shadow-card);
        }
        @media (min-width: 768px) {
          .container {
              padding: 2rem 2.5rem;
              margin: 2.5rem auto;
          }
        }
  
        .blog-page-styles header {
          background-color: var(--primary-color);
          color: white;
          padding: 1.8em 1rem;
          text-align: center;
          border-bottom: 5px solid var(--accent-color);
          animation: fadeInHeader 0.6s ease-out;
        }
        @keyframes fadeInHeader {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .blog-page-styles header h1 {
          font-family: var(--font-heading);
          font-size: clamp(1.7rem, 5vw, 2.4rem);
          font-weight: 600;
          margin: 0;
        }
        
        .page-wrapper > main { flex-grow: 1; }
  
        .blog-page-styles h2 {
          font-family: var(--font-heading);
          color: var(--text-headings);
          padding-bottom: 0.6rem;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          font-size: clamp(1.4rem, 4vw, 1.8rem);
          font-weight: 600;
          border-bottom: 1px solid var(--border-light);
        }
        .blog-page-styles section:first-of-type h2 { margin-top: 0.5rem; }
  
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .button {
          font-family: var(--font-heading);
          background-color: var(--secondary-color);
          color: white;
          border: none;
          padding: 0.65rem 1.25rem;
          border-radius: var(--border-radius-button);
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: background-color var(--transition-main), transform var(--transition-main), box-shadow var(--transition-main);
          text-decoration: none;
          box-shadow: var(--shadow-sm);
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .button:disabled { cursor: not-allowed; background-color: #a0a0a0; opacity: 0.7; }
        .button svg { width: 1em; height: 1em; }
        .button:hover:not(:disabled), .button:focus-visible:not(:disabled) {
          background-color: var(--primary-color);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
        .button:active:not(:disabled) { transform: translateY(0); box-shadow: var(--shadow-sm); }
  
        .button.button-accent {
          background-color: var(--accent-color);
          color: var(--text-headings);
        }
        .button.button-accent:hover, .button.button-accent:focus-visible {
          background-color: #ffda6b;
          color: black;
        }
  
        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
          gap: 1.5rem;
        }
  
        .video-card {
          background: var(--content-bg);
          border: 1px solid var(--border-light);
          border-radius: var(--border-radius-card);
          box-shadow: var(--shadow-subtle);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform var(--transition-main), box-shadow var(--transition-main);
          opacity: 0;
          animation: cardPopIn 0.4s ease-out forwards;
        }
        @keyframes cardPopIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .video-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
        }
        
        .video-embed-wrapper {
            position: relative;
            width: 100%;
            aspect-ratio: 16 / 9;
            background-color: #e0e0e0;
            overflow: hidden;
        }
        .video-embed-wrapper iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
        }
  
        .video-info {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
  
        .video-card h3 {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.4;
          color: var(--text-headings);
          min-height: calc(1.4em * 2);
          margin: 0 0 0.75rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden; text-overflow: ellipsis;
        }
  
        .video-link {
          display: inline-flex;
          align-items: center; gap: 0.4rem;
          padding: 0.5rem 1rem;
          background-color: #E9F2FF;
          text-align: center;
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.85rem;
          border-radius: var(--border-radius-sm);
          transition: background-color var(--transition-main), color var(--transition-main);
          margin-top: auto;
          align-self: flex-start;
        }
        .video-link:hover {
          background-color: var(--primary-color);
          color: white;
        }
  
        .playlist ul { list-style-type: none; padding: 0; }
        .playlist li {
          background: var(--content-bg);
          margin-bottom: 0.75rem;
          padding: 1rem 1.25rem;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-light);
          transition: box-shadow var(--transition-main), border-left-color var(--transition-main);
          border-left: 4px solid var(--border-light);
          opacity: 0;
          animation: cardPopIn 0.4s ease-out forwards;
        }
        .playlist li:hover {
          box-shadow: var(--shadow-md);
          border-left-color: var(--accent-color);
        }
        .playlist a {
          font-family: var(--font-heading);
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 500;
          font-size: 1.05rem;
        }
        .playlist a:hover { text-decoration: underline; color: var(--secondary-color); }
        .playlist small { display: block; color: var(--text-muted); margin-top: 0.3rem; font-size: 0.85rem; }
  
        .status-message {
          text-align: center; padding: 1.5rem; font-size: 1rem;
          color: var(--text-muted); border-radius: var(--border-radius-sm);
          background-color: var(--bg-main); margin: 1.5rem 0;
          border: 1px dashed var(--border-medium);
        }
        #video-error, .status-message.error {
          background-color: #FEF2F2; color: #991B1B; border-color: #FECACA;
        }
        .status-message.loader::before {
          content: ""; display: inline-block; width: 18px; height: 18px;
          margin-right: 0.5rem; border: 2px solid var(--text-muted);
          border-radius: 50%; border-top-color: var(--secondary-color);
          animation: spin-loader 0.7s linear infinite;
          vertical-align: -3px;
        }
        @keyframes spin-loader { to { transform: rotate(360deg); } }
        
        .channel-info {
          margin: 1.5rem 0 2rem;
          font-size: 1rem;
          text-align: center;
          padding: 1.25rem;
          background-color: #E0E7FF;
          border-radius: var(--border-radius-sm);
        }
        .channel-info p { margin: 0; color: var(--text-body); }
        .channel-info a {
          color: var(--primary-color);
          font-weight: 600;
          text-decoration: none;
        }
        .channel-info a:hover { text-decoration: underline; }
        
        .blog-page-styles footer {
          background-color: var(--text-headings);
          color: #bdc3c7;
          text-align: center;
          padding: 2.5em 1.5em;
          margin-top: auto;
          font-size: 0.9rem;
        }
        .footer-content {
          max-width: 800px;
          margin: 0 auto;
        }
        .social-links { margin-bottom: 1.5rem; }
        .social-links p {
          margin-bottom: 0.75rem;
          font-size: 1rem;
          color: white;
          font-weight: 500;
        }
        .social-links a {
          display: inline-block;
          margin: 0 0.75rem;
          color: var(--accent-color);
          transition: transform var(--transition-main), color var(--transition-main);
        }
        .social-links a:hover {
          transform: translateY(-2px) scale(1.1);
          color: white;
        }
        .social-links svg {
          width: 28px;
          height: 28px;
          fill: currentColor;
          vertical-align: middle;
        }
        .subscribe-cta { margin-bottom: 2rem; }
        .subscribe-cta p {
          margin-bottom: 1rem;
          font-size: 1.1rem;
          color: white;
          font-weight: 500;
        }
        .footer-credits {
          font-size: 0.85rem;
          line-height: 1.5;
          color: #9CA3AF;
        }
        .footer-credits a {
          color: var(--accent-color);
          text-decoration: none;
        }
        .footer-credits a:hover { text-decoration: underline; }
  
        @media (max-width: 768px) {
          .container { padding: 1.5rem; margin: 1.5rem auto; }
          .blog-page-styles header { padding: 1.5rem 1rem; }
          .video-grid { grid-template-columns: 1fr; gap: 1.25rem; }
        }
      `}</style>
      
      <div className="page-wrapper">
        <header>
          <h1>Spyderend | Resurse Video Educative</h1>
        </header>

        <main>
          <div className="container">
            <section id="recent-videos-section">
              <div className="section-header">
                <h2>Cele Mai Recente Materiale</h2>
                <button onClick={fetchLatestVideos} className="button" disabled={isLoading}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={isLoading ? { animation: 'spin-loader 0.8s linear infinite' } : {}}><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1.35-3.113a.75.75 0 0 1-1.012-1.104l.08-.073 2.438-2.333a.75.75 0 0 1 .976-.036l.08.07A4.501 4.501 0 0 1 16.5 12H14a.75.75 0 0 1-.743.648l-.007.002H9.75a.75.75 0 0 1-.175-1.48l.08-.01h4.5a3 3 0 0 0-5.446-1.472l.07.08-2.437 2.333a.75.75 0 0 1-1.104-1.012l.073-.08 2.292-2.192A6.002 6.002 0 0 1 12 6a6 6 0 0 1 5.993 5.67L18 12a.75.75 0 0 1-.648.743L17.25 13H12a.75.75 0 0 1-.036-.976l.07-.08 2.813-2.692a.75.75 0 1 1 1.027 1.092l-.073.08-2.957 2.83A4.5 4.5 0 0 1 10.65 16.887z"></path></svg>
                  <span>{isLoading ? 'Actualizez...' : 'Actualizează'}</span>
                </button>
              </div>
              <div className="channel-info">
                  <p>
                  Bine ai venit! Explorează videourile educative de pe canalul{' '}
                  <a href="https://www.youtube.com/@Spyderend_" target="_blank" rel="noopener noreferrer">Spyderend</a>
                  {' '}și pregătește-te pentru succes.
                  </p>
              </div>

              {isLoading && <div className="status-message loader">Se încarcă resursele... Vă rugăm așteptați.</div>}
              {error && <div className="status-message error">{error}</div>}
              
              <div className="video-grid">
                {!isLoading && !error && videos.map((video, index) => (
                    <div className="video-card" key={video.id.videoId} style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="video-embed-wrapper">
                            <iframe
                                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                                title={`Player video YouTube: ${video.snippet.title.replace(/"/g, '&quot;')}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                loading="lazy"
                            ></iframe>
                        </div>
                        <div className="video-info">
                            <h3 title={video.snippet.title}>{video.snippet.title}</h3>
                            <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer" className="video-link">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-2.074-9.313a.75.75 0 0 1 1.05-.003l.074.063 4.5 3.75a.75.75 0 0 1 .007 1.05l-.064.074-4.5 3.75a.75.75 0 0 1-1.124-.984l.064-.073L14.053 12l-4.151-3.45a.75.75 0 0 1-.063-1.05z"></path></svg>
                                <span>Vezi pe YouTube</span>
                            </a>
                        </div>
                    </div>
                ))}
              </div>
            </section>
            
            <section className="playlist">
                <h2>Playlisturi Recomandate</h2>
                <p>Găsește rapid informațiile de care ai nevoie cu aceste colecții tematice.</p>
                <ul>
                    <li style={{ animationDelay: `${(videos.length || 4) * 100}ms` }}>
                        <a href="https://www.youtube.com/playlist?list=PL0lUTVVqEIWOqM0rK0iawSP2RFFlAg73l" target="_blank" rel="noopener noreferrer">Gramatică pentru Evaluarea Națională</a>
                        <small>Toate lecțiile de gramatică explicate clar și concis, pentru a te pregăti eficient.</small>
                    </li>
                    <li style={{ animationDelay: `${(videos.length || 4) * 100 + 150}ms` }}>
                        <a href="#" onClick={(e) => { e.preventDefault(); alert('Acest playlist este în curs de creare. Revino în curând!'); }}>Matematică: Teorie și Probleme</a>
                        <small>[În curând] Concepte matematice și exemple rezolvate pentru o mai bună înțelegere.</small>
                    </li>
                </ul>
            </section>
          </div>
        </main>
        
        <footer>
            <div className="footer-content">
                <div className="social-links">
                    <p>Urmărește-mă și pe:</p>
                    <a href="https://www.youtube.com/@Spyderend_" target="_blank" rel="noopener noreferrer" title="YouTube @Spyderend_">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.267,4,12,4,12,4S5.733,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.733,2,12,2,12s0,4.267,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.733,20,12,20,12,20s6.267,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.267,22,12,22,12S22,7.733,21.582,6.186z M9.996,15.006V8.994l5.207,3.006L9.996,15.006z"/></svg>
                    </a>
                </div>
                <div className="subscribe-cta">
                    <p>Nu rata noile materiale video!</p>
                    <a href="https://www.youtube.com/channel/UCge2BVDGytK1o_OLwZadUEA?sub_confirmation=1" target="_blank" rel="noopener noreferrer" className="button button-accent">
                        Abonează-te la Canal
                    </a>
                </div>
                <p className="footer-credits">
                    Conținut video oferit de <a href="https://www.youtube.com/@Spyderend_" target="_blank" rel="noopener noreferrer">@Spyderend_</a> via YouTube Data API. <br />
                    © {new Date().getFullYear()} Spyderend. Toate drepturile rezervate.
                </p>
            </div>
        </footer>
      </div>
    </>
  );
}