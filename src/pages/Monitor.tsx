
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import StatusDisplay from '@/components/StatusDisplay';
import SimulateAlert from '@/components/SimulateAlert';
import { toast } from 'sonner';
import { AlertCircle, Moon } from 'lucide-react';

type Status = 'active' | 'inactive' | 'alert' | 'sleep';

const Monitor = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('active');
  const [inactiveTime, setInactiveTime] = useState<number>(0);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [timerThreshold, setTimerThreshold] = useState<number>(10 * 60 * 1000); // Default 10 minutes
  const [contactName, setContactName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [sleepEnabled, setSleepEnabled] = useState<boolean>(false);
  const [sleepTime, setSleepTime] = useState<string>('22:00');
  const [wakeTime, setWakeTime] = useState<string>('07:00');
  const [isSleepMode, setIsSleepMode] = useState<boolean>(false);
  
  // Load saved configuration
  useEffect(() => {
    const savedTimerMinutes = localStorage.getItem('guardianTimerMinutes');
    const savedContactName = localStorage.getItem('guardianContactName');
    const savedContactPhone = localStorage.getItem('guardianContactPhone');
    const savedSleepEnabled = localStorage.getItem('guardianSleepEnabled');
    const savedSleepTime = localStorage.getItem('guardianSleepTime');
    const savedWakeTime = localStorage.getItem('guardianWakeTime');
    
    if (savedTimerMinutes) {
      setTimerThreshold(parseInt(savedTimerMinutes, 10) * 60 * 1000);
    }
    
    if (savedContactName) {
      setContactName(savedContactName);
    }
    
    if (savedContactPhone) {
      setContactPhone(savedContactPhone);
    }

    if (savedSleepEnabled) {
      setSleepEnabled(savedSleepEnabled === 'true');
    }

    if (savedSleepTime) {
      setSleepTime(savedSleepTime);
    }

    if (savedWakeTime) {
      setWakeTime(savedWakeTime);
    }
    
    if (!savedContactName || !savedContactPhone) {
      toast.error("Contact d'urgence non configuré", {
        description: "Veuillez configurer un contact avant de commencer la surveillance",
        action: {
          label: "Configurer",
          onClick: () => navigate('/configure')
        }
      });
    }
  }, [navigate]);

  // Check if current time is in sleep mode
  const checkSleepMode = () => {
    if (!sleepEnabled) return false;

    const now = new Date();
    const currentTimeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                         now.getMinutes().toString().padStart(2, '0');
    
    // Convert times to minutes for easier comparison
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const sleepMinutes = parseInt(sleepTime.split(':')[0]) * 60 + parseInt(sleepTime.split(':')[1]);
    const wakeMinutes = parseInt(wakeTime.split(':')[0]) * 60 + parseInt(wakeTime.split(':')[1]);
    
    // Handle overnight sleep schedules
    if (sleepMinutes > wakeMinutes) {
      // Sleep time crosses midnight (e.g., 22:00 to 07:00)
      return currentMinutes >= sleepMinutes || currentMinutes < wakeMinutes;
    } else {
      // Same day sleep (e.g., 13:00 to 15:00)
      return currentMinutes >= sleepMinutes && currentMinutes < wakeMinutes;
    }
  };
  
  // Update inactive time and check for alerts
  useEffect(() => {
    const interval = setInterval(() => {
      // Check sleep mode
      const isSleeping = checkSleepMode();
      setIsSleepMode(isSleeping);
      
      if (isSleeping) {
        if (status !== 'sleep') {
          setStatus('sleep');
          toast.info(
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              <span>Mode veille activé</span>
            </div>,
            {
              description: `La surveillance reprendra à ${wakeTime}`,
              duration: 5000,
            }
          );
        }
        return; // Skip alert checks during sleep mode
      }
      
      const now = Date.now();
      const inactiveMs = now - lastActivity;
      setInactiveTime(inactiveMs);
      
      if (inactiveMs >= timerThreshold && status !== 'alert') {
        setStatus('alert');
        
        // Show alert notification
        toast(
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-alert">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Alerte d'inactivité</span>
            </div>
            <p className="text-sm">
              Aucune activité détectée depuis {Math.floor(inactiveMs / 60000)} minutes
            </p>
            <p className="text-xs text-muted-foreground">
              Une alerte a été envoyée à {contactName}
            </p>
          </div>,
          {
            duration: 10000,
          }
        );
      } else if (inactiveMs < timerThreshold && inactiveMs > 10000 && status !== 'inactive' && status !== 'sleep') {
        setStatus('inactive');
      } else if (inactiveMs < 10000 && status !== 'active' && status !== 'sleep') {
        setStatus('active');
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lastActivity, timerThreshold, status, contactName, sleepTime, wakeTime, sleepEnabled]);
  
  // Set up activity detection
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      if (status !== 'active' && status !== 'sleep') {
        setStatus('active');
      }
    };
    
    // Track user interactions
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('scroll', handleActivity);
    
    // Add device motion detection if available
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleActivity);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      
      if (window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleActivity);
      }
    };
  }, [status]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        <div className="page-transition space-y-8">
          <section className="text-center mb-8">
            <h2 className="text-3xl font-bold text-guardian-dark mb-3">Surveillance</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Gardien surveille l'activité de votre appareil et vous alerte en cas d'inactivité prolongée
            </p>
          </section>
          
          {isSleepMode ? (
            <div className="glass-panel p-8 text-center animate-scale-in">
              <Moon className="h-12 w-12 text-guardian/70 mx-auto mb-4" />
              <h3 className="text-2xl font-medium mb-2">Mode Veille Activé</h3>
              <p className="text-gray-600 mb-4">
                La surveillance est temporairement désactivée selon votre planning.
              </p>
              <p className="text-sm text-gray-500">
                La surveillance reprendra automatiquement à {wakeTime}.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              <StatusDisplay 
                status={status}
                inactiveTime={inactiveTime}
                threshold={timerThreshold}
              />
              
              <SimulateAlert 
                contactName={contactName}
                contactPhone={contactPhone}
                inactiveTime={inactiveTime}
              />
            </div>
          )}
          
          <div className="glass-panel p-6 animate-scale-in">
            <h3 className="text-lg font-medium mb-4">Informations sur la surveillance</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-guardian/20 text-guardian rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <span>La surveillance est active tant que cette page est ouverte</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-guardian/20 text-guardian rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <span>Une alerte sera déclenchée après {timerThreshold / 60000} minutes d'inactivité</span>
              </li>
              {sleepEnabled && (
                <li className="flex items-start gap-2">
                  <span className="bg-guardian/20 text-guardian rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <span>Mode veille activé de {sleepTime} à {wakeTime}</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="bg-guardian/20 text-guardian rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">{sleepEnabled ? 4 : 3}</span>
                <span>Gardez votre téléphone chargé et connecté à internet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-guardian/20 text-guardian rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">{sleepEnabled ? 5 : 4}</span>
                <span>Assurez-vous que les notifications et la géolocalisation sont activées</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Monitor;
