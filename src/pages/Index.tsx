
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { AlertCircle, ArrowRight, Timer, Phone } from 'lucide-react';

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
            <h1 className="text-5xl font-bold text-guardian-dark">Gardien</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Application de protection des personnes par détection d'inactivité
            </p>
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="h-12 w-12 bg-guardian/10 rounded-full flex items-center justify-center mb-6">
                <Timer className="h-6 w-6 text-guardian" />
              </div>
              <h3 className="text-xl font-medium mb-3">Détection d'inactivité</h3>
              <p className="text-gray-600 mb-6">
                Gardien surveille l'activité de votre appareil et déclenche une alerte en cas d'inactivité prolongée.
              </p>
              <Link to="/configure">
                <Button variant="link" className="text-guardian p-0 flex items-center gap-1 hover:gap-2 transition-all">
                  <span>Configurer le minuteur</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="h-12 w-12 bg-guardian/10 rounded-full flex items-center justify-center mb-6">
                <Phone className="h-6 w-6 text-guardian" />
              </div>
              <h3 className="text-xl font-medium mb-3">Contact d'urgence</h3>
              <p className="text-gray-600 mb-6">
                Définissez un contact qui recevra automatiquement vos informations d'inactivité et votre position.
              </p>
              <Link to="/configure">
                <Button variant="link" className="text-guardian p-0 flex items-center gap-1 hover:gap-2 transition-all">
                  <span>Ajouter un contact</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="glass-card p-8 md:col-span-2 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-guardian/10 rounded-full flex-shrink-0 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-guardian" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-3">Comment ça fonctionne</h3>
                  <ol className="space-y-4 text-gray-600 list-decimal list-inside mb-6">
                    <li>Configurez une durée d'inactivité et un contact d'urgence</li>
                    <li>Gardien surveille discrètement l'activité de votre appareil</li>
                    <li>Si aucun mouvement n'est détecté pendant la durée définie, une alerte est envoyée</li>
                    <li>Votre contact reçoit le temps d'inactivité et votre position GPS actuelle</li>
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
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>Application Gardien &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
