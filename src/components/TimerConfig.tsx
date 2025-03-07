
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Timer } from 'lucide-react';

interface TimerConfigProps {
  defaultValue?: number;
  onSave: (minutes: number) => void;
}

const TimerConfig: React.FC<TimerConfigProps> = ({ 
  defaultValue = 10, 
  onSave 
}) => {
  const [minutes, setMinutes] = useState<number>(defaultValue);
  
  const handleSave = () => {
    onSave(minutes);
  };

  const formatTime = (mins: number) => {
    if (mins < 60) {
      return `${mins} minute${mins > 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours} heure${hours > 1 ? 's' : ''}${remainingMins > 0 ? ` ${remainingMins} min` : ''}`;
    }
  };

  return (
    <div className="glass-panel p-6 animate-scale-in">
      <div className="flex items-center gap-3 mb-5">
        <Timer className="text-guardian h-6 w-6" />
        <h3 className="text-lg font-medium">Délai d'inactivité</h3>
      </div>
      
      <div className="text-center mb-8">
        <div className="timer-display mb-2">{formatTime(minutes)}</div>
        <p className="text-muted-foreground text-sm">
          Une alerte sera envoyée après {formatTime(minutes)} d'inactivité
        </p>
      </div>
      
      <div className="mb-8">
        <Slider
          value={[minutes]}
          min={1}
          max={180}
          step={1}
          onValueChange={(values) => setMinutes(values[0])}
          className="py-4"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>1 min</span>
          <span>1 heure</span>
          <span>3 heures</span>
        </div>
      </div>
      
      <Button 
        onClick={handleSave}
        className="w-full glass-button"
      >
        Enregistrer
      </Button>
    </div>
  );
};

export default TimerConfig;
