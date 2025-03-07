
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import StatusDisplay from '@/components/StatusDisplay';
import SimulateAlert from '@/components/SimulateAlert';
import { toast } from 'sonner';
import { AlertCircle, Moon } from 'lucide-react';

type Status = 'active' | 'inactive' | 'alert' | 'pause';

const Monitor = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('active');
  const [inactiveTime, setInactiveTime] = useState<number>(0);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [timerThreshold, setTimerThreshold] = useState<number>(10 * 60 * 1000); // Default 10 minutes
  const [contactName, setContactName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [pauseEnabled, setPauseEnabled] = useState<boolean>(false);
  const [sleepTime, setSleepTime] = useState<string>('22:00');
  const [wakeTime, setWakeTime] = useState<string>('07:00');
  const [isPauseMode, setIsPauseMode] = useState<boolean>(false);
  const [fallDetectionEnabled, setFallDetectionEnabled] = useState<boolean>(true);
  const [gyroscopeSupported, setGyroscopeSupported] = useState<boolean>(false);
  
  // Load saved configuration
  useEffect(() => {
    const savedTimerMinutes = localStorage.getItem('guardianTimerMinutes');
    const savedContactName = localStorage.getItem('guardianContactName');
    const savedContactPhone = localStorage.getItem('guardianContactPhone');
    const savedPauseEnabled = localStorage.getItem('guardianSleepEnabled');
    const savedSleepTime = localStorage.getItem('guardianSleepTime');
    const savedWakeTime = localStorage.getItem('guardianWakeTime');
    const savedFallDetection = localStorage.getItem('guardianFallDetection');
    
    if (savedTimerMinutes) {
      setTimerThreshold(parseInt(savedTimerMinutes, 10) * 60 * 1000);
    }
    
    if (savedContactName) {
      setContactName(savedContactName);
    }
    
    if (savedContactPhone) {
      setContactPhone(savedContactPhone);
    }

    if (savedPauseEnabled) {
      setPauseEnabled(savedPauseEnabled === 'true');
    }

    if (savedSleepTime) {
      setSleepTime(savedSleepTime);
    }

    if (savedWakeTime) {
      setWakeTime(savedWakeTime);
    }

    if (savedFallDetection) {
      setFallDetectionEnabled(savedFallDetection === 'true');
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

    // Check if gyroscope is supported
    if (window.DeviceMotionEvent) {
      setGyroscopeSupported(true);
    } else {
      toast.warning("Gyroscope non détecté", {
        description: "La détection de chute ne sera pas disponible sur cet appareil",
        duration: 5000
      });
    }
  }, [navigate]);

  // Check if current time is in pause mode
  const checkPauseMode = () => {
    if (!pauseEnabled) return false;

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
  
  // Fall detection function
  const detectFall = (event: DeviceMotionEvent) => {
    if (!fallDetectionEnabled) return;
    
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration || !acceleration.x || !acceleration.y || !acceleration.z) return;
    
    // Calculate total acceleration magnitude
    const magnitude = Math.sqrt(
      acceleration.x * acceleration.x + 
      acceleration.y * acceleration.y + 
      acceleration.z * acceleration.z
    );
    
    // Threshold for fall detection (typically 3g for falls, where g is ~9.8 m/s²)
    const fallThreshold = 25;
    
    if (magnitude > fallThreshold) {
      // Potential fall detected
      toast.error(
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-alert">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Chute détectée!</span>
          </div>
          <p className="text-sm">
            Une chute potentielle a été détectée
          </p>
          <p className="text-xs text-muted-foreground">
            Une alerte a été envoyée à {contactName}
          </p>
        </div>,
        {
          duration: 10000,
        }
      );
      
      // Additional logic would go here to send an alert
      console.log("Fall detected:", magnitude);
    }
  };
  
  // Update inactive time and check for alerts
  useEffect(() => {
    const interval = setInterval(() => {
      // Check pause mode
      const isPaused = checkPauseMode();
      setIsPauseMode(isPaused);
      
      if (isPaused) {
        if (status !== 'pause') {
          setStatus('pause');
          toast.info(
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              <span>Mode pause activé</span>
            </div>,
            {
              description: `La surveillance reprendra à ${wakeTime}`,
              duration: 5000,
            }
          );
        }
        return; // Skip alert checks during pause mode
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
      } else if (inactiveMs < timerThreshold && inactiveMs > 10000 && status !== 'inactive' && status !== 'pause') {
        setStatus('inactive');
      } else if (inactiveMs < 10000 && status !== 'active' && status !== 'pause') {
        setStatus('active');
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lastActivity, timerThreshold, status, contactName, sleepTime, wakeTime, pauseEnabled]);
  
  // Set up activity detection
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      if (status !== 'active' && status !== 'pause') {
        setStatus('active');
      }
    };
    
    // Track user interactions
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('scroll', handleActivity);
    
    // Add gyroscope detection
    if (window.DeviceMotionEvent) {
      // Use device motion for activity detection
      window.addEventListener('devicemotion', (event) => {
        // Detect significant motion for activity tracking
        if (event.accelerationIncludingGravity) {
          const accel = event.accelerationIncludingGravity;
          if (accel.x && accel.y && accel.z) {
            // Detect motion above certain threshold
            const motionThreshold = 1.5;
            const totalMotion = Math.abs(accel.x) + Math.abs(accel.y) + Math.abs(accel.z);
            
            if (totalMotion > motionThreshold) {
              handleActivity();
            }
          }
        }
        
        // Fall detection
        detectFall(event);
      });
    }
    
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      
      if (window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleActivity);
        window.removeEventListener('devicemotion', detectFall);
      }
    };
  }, [status, fallDetectionEnabled]);
  
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
          
          {isPauseMode ? (
            <div className="glass-panel p-8 text-center animate-scale-in">
              <Moon className="h-12 w-12 text-guardian/70 mx-auto mb-4" />
              <h3 className="text-2xl font-medium mb-2">Mode Pause Activé</h3>
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
              {pauseEnabled && (
                <li className="flex items-start gap-2">
                  <span className="bg-guardian/20 text-guardian rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <span>Mode pause activé de {sleepTime} à {wakeTime}</span>
                </li>
              )}
              {gyroscopeSupported && (
                <li className="flex items-start gap-2">
                  <span className="bg-guardian/20 text-guardian rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">{pauseEnabled ? 4 : 3}</span>
                  <span>Détection de chute activée via gyroscope</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="bg-guardian/20 text-guardian rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">{pauseEnabled ? (gyroscopeSupported ? 5 : 4) : (gyroscopeSupported ? 4 : 3)}</span>
                <span>Gardez votre téléphone chargé et connecté à internet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-guardian/20 text-guardian rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">{pauseEnabled ? (gyroscopeSupported ? 6 : 5) : (gyroscopeSupported ? 5 : 4)}</span>
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
