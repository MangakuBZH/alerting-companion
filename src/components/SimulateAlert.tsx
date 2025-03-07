
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface SimulateAlertProps {
  contactName: string;
  contactPhone: string;
  inactiveTime: number;
}

const SimulateAlert: React.FC<SimulateAlertProps> = ({
  contactName,
  contactPhone,
  inactiveTime,
}) => {
  const [isSending, setIsSending] = useState(false);
  
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };
  
  const handleSimulateAlert = () => {
    if (!contactName || !contactPhone) {
      toast.error("Veuillez configurer un contact d'urgence");
      return;
    }
    
    setIsSending(true);
    
    // Simulate sending alert
    setTimeout(() => {
      setIsSending(false);
      toast.success("Alerte de simulation envoyée", {
        description: `Une notification a été simulée vers ${contactName}`,
      });
      
      // Simulate receiving alert on another device
      setTimeout(() => {
        toast(
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-alert">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Alerte d'inactivité</span>
            </div>
            <p>Inactivité détectée depuis {formatTime(inactiveTime)}</p>
            <p className="text-sm text-muted-foreground">Position: 48.856614, 2.352222</p>
          </div>
        );
      }, 2000);
    }, 1500);
  };
  
  return (
    <div className="glass-panel p-6 animate-scale-in">
      <div className="flex items-center gap-3 mb-5">
        <AlertCircle className="text-alert h-6 w-6" />
        <h3 className="text-lg font-medium">Simulation d'alerte</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Cette option vous permet de simuler l'envoi d'une alerte pour tester le système
      </p>
      
      <Button 
        variant="destructive"
        className="w-full"
        onClick={handleSimulateAlert}
        disabled={isSending}
      >
        {isSending ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
            Envoi en cours...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span>Simuler une alerte</span>
            <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </div>
  );
};

export default SimulateAlert;
