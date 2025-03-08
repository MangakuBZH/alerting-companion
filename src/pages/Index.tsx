
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { AlertCircle, ArrowRight, Timer, Phone, Shield, PersonStanding, Heart } from 'lucide-react';

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full bg-guardian/10 animate-ping"></div>
          <div className="absolute inset-2 rounded-full bg-guardian/20"></div>
          <div className="absolute inset-4 rounded-full bg-guardian/40"></div>
          <div className="absolute inset-6 rounded-full bg-guardian/60"></div>
          <div className="absolute inset-8 rounded-full bg-guardian"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        <div className="page-transition space-y-12">
          <section className="text-center space-y-4 mb-12">
            <h1 className="text-5xl font-bold text-guardian-dark">Ange Gardien Live</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Application de protection des personnes par détection d'inactivité et de chute
            </p>
          </section>
          
          {/* New Introduction Section */}
          <div className="glass-card p-8 md:col-span-2 animate-slide-up">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-guardian/10 rounded-full flex-shrink-0 flex items-center justify-center">
                <Shield className="h-6 w-6 text-guardian" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3">Votre protection personnelle</h3>
                <p className="text-gray-600 mb-4">
                  Ange Gardien Live est une application conçue pour assurer votre sécurité grâce à trois fonctionnalités essentielles :
                </p>
                <ul className="space-y-3 list-disc list-inside text-gray-600 mb-6">
                  <li><span className="font-medium">Détection de chute</span> - Utilise le gyroscope de votre appareil pour identifier les mouvements brusques pouvant indiquer une chute ou un accident</li>
                  <li><span className="font-medium">Surveillance d'inactivité</span> - Détecte l'absence d'interaction avec votre appareil pendant une durée définie</li>
                  <li><span className="font-medium">Alerte automatique</span> - Envoie votre position GPS et les informations d'alerte à votre contact d'urgence</li>
                </ul>
                <Link to="/configure">
                  <Button className="glass-button">
                    <span>Configurer l'application</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="h-12 w-12 bg-guardian/10 rounded-full flex items-center justify-center mb-6">
                <PersonStanding className="h-6 w-6 text-guardian" />
              </div>
              <h3 className="text-xl font-medium mb-3">Détection de chute</h3>
              <p className="text-gray-600">
                Grâce au gyroscope, l'application détecte automatiquement les mouvements brusques pouvant indiquer une chute ou un accident.
              </p>
            </div>
            
            <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="h-12 w-12 bg-guardian/10 rounded-full flex items-center justify-center mb-6">
                <Timer className="h-6 w-6 text-guardian" />
              </div>
              <h3 className="text-xl font-medium mb-3">Détection d'inactivité</h3>
              <p className="text-gray-600">
                Ange Gardien surveille l'activité de votre appareil et déclenche une alerte en cas d'inactivité prolongée.
              </p>
            </div>
            
            <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="h-12 w-12 bg-guardian/10 rounded-full flex items-center justify-center mb-6">
                <Phone className="h-6 w-6 text-guardian" />
              </div>
              <h3 className="text-xl font-medium mb-3">Contact d'urgence</h3>
              <p className="text-gray-600">
                Définissez un contact qui recevra automatiquement vos informations d'alerte et votre position GPS.
              </p>
            </div>
            
            <div className="glass-card p-8 md:col-span-3 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-guardian/10 rounded-full flex-shrink-0 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-guardian" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-3">Comment ça fonctionne</h3>
                  <ol className="space-y-4 text-gray-600 list-decimal list-inside mb-6">
                    <li>Configurez une durée d'inactivité, une détection de chute et un contact d'urgence</li>
                    <li>Ange Gardien surveille discrètement l'activité et les mouvements de votre appareil</li>
                    <li>Si une chute est détectée ou si aucune activité n'est enregistrée pendant la durée définie, une alerte est envoyée</li>
                    <li>Votre contact reçoit l'alerte avec votre position GPS actuelle</li>
                    <li>Vous pouvez configurer des heures de pause (par exemple la nuit) où la surveillance est désactivée</li>
                  </ol>
                  <Link to="/monitor">
                    <Button className="glass-button">
                      <span>Commencer la surveillance</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Donation Section */}
          <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '500ms' }}>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-guardian/10 rounded-full flex-shrink-0 flex items-center justify-center">
                <Heart className="h-6 w-6 text-guardian" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3">Soutenez notre mission</h3>
                <p className="text-gray-600 mb-6">
                  Ange Gardien Live est un projet développé avec passion pour assurer la sécurité des personnes vulnérables. 
                  Votre soutien nous permet de continuer à améliorer l'application et à la maintenir accessible à tous.
                </p>
                <a href="https://donate.angegardien.live" target="_blank" rel="noopener noreferrer">
                  <Button className="glass-button bg-guardian-light hover:bg-guardian">
                    <Heart className="h-4 w-4 mr-2" />
                    <span>Faire un don</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>Application Ange Gardien Live &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
