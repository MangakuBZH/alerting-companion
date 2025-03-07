
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import TimerConfig from '@/components/TimerConfig';
import ContactConfig from '@/components/ContactConfig';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Configure = () => {
  const navigate = useNavigate();
  const [timerMinutes, setTimerMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('guardianTimerMinutes');
    return saved ? parseInt(saved, 10) : 10;
  });
  
  const [contactName, setContactName] = useState<string>(() => {
    return localStorage.getItem('guardianContactName') || '';
  });
  
  const [contactPhone, setContactPhone] = useState<string>(() => {
    return localStorage.getItem('guardianContactPhone') || '';
  });
  
  const handleSaveTimer = (minutes: number) => {
    setTimerMinutes(minutes);
    localStorage.setItem('guardianTimerMinutes', minutes.toString());
    toast.success(`Délai d'inactivité défini à ${minutes} minutes`);
  };
  
  const handleSaveContact = (name: string, phone: string) => {
    setContactName(name);
    setContactPhone(phone);
    localStorage.setItem('guardianContactName', name);
    localStorage.setItem('guardianContactPhone', phone);
  };
  
  const handleStartMonitoring = () => {
    if (!contactName || !contactPhone) {
      toast.error("Veuillez configurer un contact d'urgence");
      return;
    }
    
    navigate('/monitor');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        <div className="page-transition space-y-8">
          <section className="text-center mb-8">
            <h2 className="text-3xl font-bold text-guardian-dark mb-3">Configuration</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Personnalisez les paramètres de surveillance et définissez votre contact d'urgence
            </p>
          </section>
          
          <div className="grid md:grid-cols-2 gap-8">
            <TimerConfig 
              defaultValue={timerMinutes} 
              onSave={handleSaveTimer} 
            />
            
            <ContactConfig 
              defaultName={contactName}
              defaultPhone={contactPhone}
              onSave={handleSaveContact}
            />
          </div>
          
          <div className="flex justify-center mt-8">
            <Button
              className="glass-button"
              onClick={handleStartMonitoring}
            >
              <span>Commencer la surveillance</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Configure;
