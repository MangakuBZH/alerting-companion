
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, MapPin, Timer } from 'lucide-react';

type Status = 'active' | 'inactive' | 'alert';

interface StatusDisplayProps {
  status: Status;
  inactiveTime?: number;
  threshold?: number;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({
  status,
  inactiveTime = 0,
  threshold = 10 * 60 * 1000, // Default 10 minutes in milliseconds
}) => {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  useEffect(() => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          setLocation(position.coords);
          setLocationError(null);
        },
        (error) => {
          let errorMsg = "Erreur de localisation";
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg = "Accès à la localisation refusé";
          }
          setLocationError(errorMsg);
        }
      );
      
      return () => navigator.geolocation.clearWatch(id);
    } else {
      setLocationError("La géolocalisation n'est pas prise en charge par ce navigateur");
    }
  }, []);
  
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const getStatusClass = (status: Status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'alert': return 'status-alert';
    }
  };
  
  const getStatusText = (status: Status) => {
    switch (status) {
      case 'active': return 'Activité détectée';
      case 'inactive': return 'Inactif';
      case 'alert': return 'Alerte!';
    }
  };
  
  const percentComplete = Math.min(100, (inactiveTime / threshold) * 100);
  
  return (
    <div className="glass-panel p-6 animate-scale-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">État actuel</h3>
        <div className={cn("flex items-center gap-2", getStatusClass(status))}>
          <span className="inline-block h-3 w-3 rounded-full bg-current animate-pulse" />
          <span className="font-medium">{getStatusText(status)}</span>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Timer className="h-6 w-6 text-guardian" />
          <div>
            <p className="text-sm text-muted-foreground">Temps d'inactivité</p>
            <p className="text-xl font-mono font-medium">{formatTime(inactiveTime)}</p>
          </div>
        </div>
        
        {status !== 'active' && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500 ease-out",
                percentComplete >= 90 ? "bg-alert" : "bg-guardian"
              )}
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        )}
        
        <div className="flex items-center gap-4">
          <MapPin className="h-6 w-6 text-guardian" />
          <div>
            <p className="text-sm text-muted-foreground">Position actuelle</p>
            {locationError ? (
              <p className="text-sm text-alert">{locationError}</p>
            ) : location ? (
              <p className="text-sm font-mono">
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </p>
            ) : (
              <p className="text-sm">Recherche de position...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusDisplay;
