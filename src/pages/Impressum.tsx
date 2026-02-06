import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const Impressum: React.FC = () => {
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

            <h1 className="font-heading text-4xl md:text-5xl text-champagne-light mb-2">
              Impressum
            </h1>
            <p className="text-champagne/50 mb-8">§5 TMG</p>
            
            <div className="divider-imperial max-w-md mb-12" />

            <div className="prose prose-invert prose-champagne space-y-8 text-champagne/80">
              <section>
                <h2 className="font-heading text-2xl text-champagne-light mb-4">WeiDao 味道佳 Restaurant</h2>
                <p className="leading-relaxed">
                  Oderberger Str. 27<br />
                  10435 Berlin<br />
                  Deutschland
                </p>
              </section>

              <section>
                <h3 className="font-heading text-xl text-champagne-light mb-3">Vertreten durch:</h3>
                <p>Jiasheng, Deng</p>
              </section>

              <section>
                <h3 className="font-heading text-xl text-champagne-light mb-3">Kontakt:</h3>
                <p>
                  Telefon: +49 30 94042558<br />
                  E-Mail: <a href="mailto:info@weidaojia.de" className="text-champagne hover:text-champagne-light transition-colors">info@weidaojia.de</a>
                </p>
              </section>

              <section>
                <h3 className="font-heading text-xl text-champagne-light mb-3">Umsatzsteuer-ID:</h3>
                <p>USt-IdNr. gemäß §27a Umsatzsteuergesetz: [DE…]</p>
              </section>

              <section>
                <h3 className="font-heading text-xl text-champagne-light mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</h3>
                <p>Jiasheng Deng, Oderberger Str. 27, 10435 Berlin</p>
              </section>

              <section>
                <h3 className="font-heading text-xl text-champagne-light mb-3">Haftung für Inhalte</h3>
                <p className="leading-relaxed">
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                </p>
              </section>

              <section>
                <h3 className="font-heading text-xl text-champagne-light mb-3">Haftung für Links</h3>
                <p className="leading-relaxed">
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
                </p>
              </section>

              <section>
                <h3 className="font-heading text-xl text-champagne-light mb-3">Urheberrecht</h3>
                <p className="leading-relaxed">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.
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

export default Impressum;
