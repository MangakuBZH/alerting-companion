
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import TimerConfig from '@/components/TimerConfig';
import ContactConfig from '@/components/ContactConfig';
import SmsVerification from '@/components/SmsVerification';
import SleepScheduleConfig from '@/components/SleepScheduleConfig';
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

  const [sleepTime, setSleepTime] = useState<string>(() => {
    return localStorage.getItem('guardianSleepTime') || '22:00';
  });

  const [wakeTime, setWakeTime] = useState<string>(() => {
    return localStorage.getItem('guardianWakeTime') || '07:00';
  });

  const [sleepEnabled, setSleepEnabled] = useState<boolean>(() => {
    return localStorage.getItem('guardianSleepEnabled') === 'true';
  });

  const [showVerification, setShowVerification] = useState(false);
  const [pendingTimer, setPendingTimer] = useState<number | null>(null);
  const [pendingContact, setPendingContact] = useState<{name: string, phone: string} | null>(null);
  const [pendingSleep, setPendingSleep] = useState<{sleepTime: string, wakeTime: string, enabled: boolean} | null>(null);
  const [configVerified, setConfigVerified] = useState(false);
  
  const handleSaveTimer = (minutes: number) => {
    setPendingTimer(minutes);
    
    // Si le contact est déjà configuré, montrer la vérification
    if (contactPhone) {
      setShowVerification(true);
    } else {
      // Sinon, enregistrer temporairement et demander de configurer le contact
      setTimerMinutes(minutes);
      localStorage.setItem('guardianTimerMinutes', minutes.toString());
      toast.info("Configurez un contact d'urgence pour finaliser", {
        duration: 5000
      });
    }
  };
  
  const handleSaveContact = (name: string, phone: string) => {
    setPendingContact({name, phone});
    setShowVerification(true);
  };

  const handleSaveSleepSchedule = (sleepTime: string, wakeTime: string, enabled: boolean) => {
    setPendingSleep({sleepTime, wakeTime, enabled});
    
    // Si le contact est déjà configuré, montrer la vérification
    if (contactPhone) {
      setShowVerification(true);
    } else {
      // Sinon, enregistrer temporairement et demander de configurer le contact
      setSleepTime(sleepTime);
      setWakeTime(wakeTime);
      setSleepEnabled(enabled);
      localStorage.setItem('guardianSleepTime', sleepTime);
      localStorage.setItem('guardianWakeTime', wakeTime);
      localStorage.setItem('guardianSleepEnabled', enabled.toString());
      toast.info("Configurez un contact d'urgence pour finaliser", {
        duration: 5000
      });
    }
  };
  
  const handleVerificationSuccess = () => {
    // Enregistrer les configurations en attente
    if (pendingTimer !== null) {
      setTimerMinutes(pendingTimer);
      localStorage.setItem('guardianTimerMinutes', pendingTimer.toString());
    }
    
    if (pendingContact) {
      setContactName(pendingContact.name);
      setContactPhone(pendingContact.phone);
      localStorage.setItem('guardianContactName', pendingContact.name);
      localStorage.setItem('guardianContactPhone', pendingContact.phone);
    }

    if (pendingSleep) {
      setSleepTime(pendingSleep.sleepTime);
      setWakeTime(pendingSleep.wakeTime);
      setSleepEnabled(pendingSleep.enabled);
      localStorage.setItem('guardianSleepTime', pendingSleep.sleepTime);
      localStorage.setItem('guardianWakeTime', pendingSleep.wakeTime);
      localStorage.setItem('guardianSleepEnabled', pendingSleep.enabled.toString());
    }
    
    setShowVerification(false);
    setPendingTimer(null);
    setPendingContact(null);
    setPendingSleep(null);
    setConfigVerified(true);
    
    toast.success("Configuration validée avec succès", {
      description: "Vous pouvez maintenant démarrer la surveillance"
    });
  };
  
  const handleCancelVerification = () => {
    setShowVerification(false);
    setPendingTimer(null);
    setPendingContact(null);
    setPendingSleep(null);
  };
  
  const handleStartMonitoring = () => {
    if (!contactName || !contactPhone) {
      toast.error("Veuillez configurer un contact d'urgence");
      return;
    }
    
    if (!configVerified && !localStorage.getItem('configVerified')) {
      toast.error("Veuillez valider la configuration par SMS");
      return;
    }
    
    navigate('/monitor');
  };

  // Stocker l'état de vérification
  useEffect(() => {
    if (configVerified) {
      localStorage.setItem('configVerified', 'true');
    }
  }, [configVerified]);

  // Charger l'état de vérification
  useEffect(() => {
    const verified = localStorage.getItem('configVerified');
    if (verified === 'true') {
      setConfigVerified(true);
    }
  }, []);
  
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
          
          {showVerification ? (
            <SmsVerification 
              phoneNumber={pendingContact?.phone || contactPhone}
              onVerify={handleVerificationSuccess}
              onCancel={handleCancelVerification}
            />
          ) : (
            <div className="grid gap-8">
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
              
              <SleepScheduleConfig
                defaultSleepTime={sleepTime}
                defaultWakeTime={wakeTime}
                defaultEnabled={sleepEnabled}
                onSave={handleSaveSleepSchedule}
              />
            </div>
          )}
          
          <div className="flex justify-center mt-8">
            <Button
              className="glass-button"
              onClick={handleStartMonitoring}
              disabled={!configVerified && !localStorage.getItem('configVerified')}
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
