
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface SleepScheduleConfigProps {
  defaultSleepTime: string;
  defaultWakeTime: string;
  defaultEnabled: boolean;
  onSave: (sleepTime: string, wakeTime: string, enabled: boolean) => void;
}

const SleepScheduleConfig: React.FC<SleepScheduleConfigProps> = ({
  defaultSleepTime,
  defaultWakeTime,
  defaultEnabled,
  onSave
}) => {
  const [sleepTime, setSleepTime] = useState(defaultSleepTime);
  const [wakeTime, setWakeTime] = useState(defaultWakeTime);
  const [enabled, setEnabled] = useState(defaultEnabled);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(sleepTime, wakeTime, enabled);
  };

  return (
    <div className="glass-panel p-6 animate-scale-in">
      <div className="flex items-center mb-4">
        <Clock className="h-6 w-6 text-guardian mr-2" />
        <h3 className="text-xl font-medium text-guardian-dark">Mode Pause</h3>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex items-center justify-between">
          <Label htmlFor="sleep-schedule-enabled" className="flex-1">Activer le mode pause</Label>
          <Switch 
            id="sleep-schedule-enabled" 
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="sleep-time" className="block mb-2">Heure de début (pause)</Label>
            <Input
              id="sleep-time"
              type="time"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              disabled={!enabled}
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="wake-time" className="block mb-2">Heure de fin (reprise)</Label>
            <Input
              id="wake-time"
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              disabled={!enabled}
              className="w-full"
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full mt-6 bg-guardian hover:bg-guardian/90 text-white"
        >
          Enregistrer
        </Button>
      </form>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Pendant les heures de pause, la surveillance est désactivée.</p>
        <p>Idéal pour la nuit ou les périodes où vous n'avez pas besoin d'être surveillé.</p>
      </div>
    </div>
  );
};

export default SleepScheduleConfig;
