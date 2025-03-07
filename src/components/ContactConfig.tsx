
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, User } from 'lucide-react';
import { toast } from 'sonner';

interface ContactConfigProps {
  defaultName?: string;
  defaultPhone?: string;
  onSave: (name: string, phone: string) => void;
}

const ContactConfig: React.FC<ContactConfigProps> = ({
  defaultName = '',
  defaultPhone = '',
  onSave
}) => {
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  
  const handleSave = () => {
    if (!name || !phone) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    // Simple phone validation
    const phoneRegex = /^\+?[0-9]{10,14}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      toast.error("Numéro de téléphone invalide");
      return;
    }
    
    onSave(name, phone);
    toast.success("Contact d'urgence enregistré");
  };
  
  return (
    <div className="glass-panel p-6 animate-scale-in">
      <div className="flex items-center gap-3 mb-5">
        <Phone className="text-guardian h-6 w-6" />
        <h3 className="text-lg font-medium">Contact d'urgence</h3>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="contactName">Nom</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="contactName"
              placeholder="Nom du contact"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Numéro de téléphone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="contactPhone"
              placeholder="Ex: +33612345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10"
            />
          </div>
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

export default ContactConfig;
