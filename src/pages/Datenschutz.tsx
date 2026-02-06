import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const Datenschutz: React.FC = () => {
  return (
    <div className="min-h-screen bg-charcoal-dark">
      <Header />
      
      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-champagne/70 hover:text-champagne transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück zur Startseite
            </Link>

            <h1 className="font-heading text-4xl md:text-5xl text-champagne-light mb-8">
              Datenschutzerklärung
            </h1>
            
            <div className="divider-imperial max-w-md mb-12" />

            <p className="text-champagne/80 mb-10 leading-relaxed">
              Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TTDSG).
            </p>

            <div className="prose prose-invert prose-champagne space-y-10 text-champagne/80">
              <section>
                <h2 className="font-heading text-2xl text-champagne-light mb-4">1. Verantwortlicher</h2>
                <p className="leading-relaxed">
                  WeiDaoJia 味道佳<br />
                  Jiasheng, Deng<br />
                  Oderberger Str. 27, 10435 Berlin<br />
                  E-Mail: <a href="mailto:info@weidaojia.de" className="text-champagne hover:text-champagne-light transition-colors">info@weidaojia.de</a><br />
                  Telefon: +49 30 94042558
                </p>
              </section>

              <section>
                <h2 className="font-heading text-2xl text-champagne-light mb-4">2. Zugriffsdaten / Server-Logfiles</h2>
                <p className="leading-relaxed mb-4">
                  Beim Besuch unserer Website werden automatisch Informationen erfasst (z. B. IP-Adresse, Datum und Uhrzeit des Zugriffs, Browsertyp, Betriebssystem).
                  Diese Daten werden aus Sicherheitsgründen und zur Sicherstellung eines störungsfreien Betriebs verarbeitet. Eine Zusammenführung mit anderen Datenquellen erfolgt nicht.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-champagne-light">Hosting-Anbieter:</strong> Netcup GmbH (Deutschland).<br />
                  Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherem Betrieb der Website).
                </p>
              </section>

              <section>
                <h2 className="font-heading text-2xl text-champagne-light mb-4">3. Cookies</h2>
                <p className="leading-relaxed">
                  Unsere Website verwendet keine Tracking- oder Marketing-Cookies.
                  Es werden nur technisch notwendige Cookies eingesetzt, sofern erforderlich. Eine Einwilligung ist hierfür nicht notwendig.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-2xl text-champagne-light mb-4">4. Kontaktaufnahme</h2>
                <p className="leading-relaxed">
                  Wenn Sie uns per E-Mail kontaktieren, werden Ihre Angaben zwecks Bearbeitung der Anfrage gespeichert (Art. 6 Abs. 1 lit. b DSGVO). Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-2xl text-champagne-light mb-4">5. Ihre Rechte</h2>
                <p className="leading-relaxed mb-3">Sie haben jederzeit das Recht auf:</p>
                <ul className="list-disc list-inside space-y-1 text-champagne/70">
                  <li>Auskunft (Art. 15 DSGVO)</li>
                  <li>Berichtigung (Art. 16 DSGVO)</li>
                  <li>Löschung (Art. 17 DSGVO)</li>
                  <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                  <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                  <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading text-2xl text-champagne-light mb-4">6. Beschwerderecht</h2>
                <p className="leading-relaxed">
                  Sie haben das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde zu beschweren.
                  Zuständig ist in der Regel die Aufsichtsbehörde Ihres Bundeslandes (z. B. Berlin: Berliner Beauftragte für Datenschutz und Informationsfreiheit).
                </p>
              </section>

              <section>
                <h2 className="font-heading text-2xl text-champagne-light mb-4">7. SSL-/TLS-Verschlüsselung</h2>
                <p className="leading-relaxed">
                  Diese Seite nutzt aus Sicherheitsgründen eine SSL-/TLS-Verschlüsselung.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-2xl text-champagne-light mb-4">8. Aktualität</h2>
                <p className="leading-relaxed">
                  Diese Datenschutzerklärung ist aktuell gültig und hat den Stand: 05.02.2026.<br />
                  Wir behalten uns vor, sie bei Bedarf anzupassen.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-champagne/10 py-8 text-center">
        <p className="text-champagne/40 text-sm">
          © {new Date().getFullYear()} Weidaojia 味道佳. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Datenschutz;
