
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { AlertCircle, ArrowRight, Timer, Phone, Shield, PersonStanding, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

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
            <h1 className="text-5xl font-bold text-guardian-dark">{t('app.name')}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('app.tagline')}
            </p>
          </section>
          
          {/* Introduction Section */}
          <div className="glass-card p-8 md:col-span-2 animate-slide-up">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-guardian/10 rounded-full flex-shrink-0 flex items-center justify-center">
                <Shield className="h-6 w-6 text-guardian" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3">{t('home.protection.title')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('home.protection.description')}
                </p>
                <ul className="space-y-3 list-disc list-inside text-gray-600 mb-6">
                  <li>{t('home.protection.feature1')}</li>
                  <li>{t('home.protection.feature2')}</li>
                  <li>{t('home.protection.feature3')}</li>
                </ul>
                <Link to="/configure">
                  <Button className="glass-button">
                    <span>{t('home.configure.app')}</span>
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
              <h3 className="text-xl font-medium mb-3">{t('home.falldetection.title')}</h3>
              <p className="text-gray-600">
                {t('home.falldetection.description')}
              </p>
            </div>
            
            <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="h-12 w-12 bg-guardian/10 rounded-full flex items-center justify-center mb-6">
                <Timer className="h-6 w-6 text-guardian" />
              </div>
              <h3 className="text-xl font-medium mb-3">{t('home.inactivity.title')}</h3>
              <p className="text-gray-600">
                {t('home.inactivity.description')}
              </p>
            </div>
            
            <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="h-12 w-12 bg-guardian/10 rounded-full flex items-center justify-center mb-6">
                <Phone className="h-6 w-6 text-guardian" />
              </div>
              <h3 className="text-xl font-medium mb-3">{t('home.emergency.title')}</h3>
              <p className="text-gray-600">
                {t('home.emergency.description')}
              </p>
            </div>
            
            <div className="glass-card p-8 md:col-span-3 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-guardian/10 rounded-full flex-shrink-0 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-guardian" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-3">{t('home.how.title')}</h3>
                  <ol className="space-y-4 text-gray-600 list-decimal list-inside mb-6">
                    <li>{t('home.how.step1')}</li>
                    <li>{t('home.how.step2')}</li>
                    <li>{t('home.how.step3')}</li>
                    <li>{t('home.how.step4')}</li>
                    <li>{t('home.how.step5')}</li>
                  </ol>
                  <Link to="/monitor">
                    <Button className="glass-button">
                      <span>{t('home.monitoring.start')}</span>
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
                <h3 className="text-xl font-medium mb-3">{t('home.donation.title')}</h3>
                <p className="text-gray-600 mb-6">
                  {t('home.donation.description')}
                </p>
                <a href="https://donate.angegardien.live" target="_blank" rel="noopener noreferrer">
                  <Button className="glass-button bg-guardian-light hover:bg-guardian">
                    <Heart className="h-4 w-4 mr-2" />
                    <span>{t('home.donation.button')}</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>{t('footer.copyright')} &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
