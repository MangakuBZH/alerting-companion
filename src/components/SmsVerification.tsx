
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Shield, Send } from 'lucide-react';

interface SmsVerificationProps {
  phoneNumber: string;
  onVerify: () => void;
  onCancel: () => void;
}

const SmsVerification: React.FC<SmsVerificationProps> = ({
  phoneNumber,
  onVerify,
  onCancel
}) => {
  const [code, setCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  
  const sendVerificationCode = () => {
    if (!phoneNumber) {
      toast.error("Numéro de téléphone invalide");
      return;
    }
    
    setIsSending(true);
    
    // Simuler l'envoi du code (remplacer par une vraie API d'envoi de SMS)
    setTimeout(() => {
      setIsSending(false);
      setCodeSent(true);
      toast.success(`Code de vérification envoyé au ${phoneNumber}`);
    }, 1500);
  };
  
  const verifyCode = () => {
    if (!code || code.length < 4) {
      toast.error("Veuillez saisir un code valide");
      return;
    }
    
    setIsVerifying(true);
    
    // Simuler la vérification du code (remplacer par une vraie vérification)
    setTimeout(() => {
      setIsVerifying(false);
      
      // Code de test: 1234
      if (code === '1234') {
        toast.success("Configuration vérifiée et enregistrée");
        onVerify();
      } else {
        toast.error("Code incorrect, veuillez réessayer");
      }
    }, 1500);
  };
  
  return (
    <div className="glass-panel p-6 animate-scale-in">
      <div className="flex items-center gap-3 mb-5">
        <Shield className="text-guardian h-6 w-6" />
        <h3 className="text-lg font-medium">Vérification de sécurité</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Pour sécuriser la configuration, un code de vérification sera envoyé au numéro de contact d'urgence.
      </p>
      
      {!codeSent ? (
        <div className="space-y-6">
          <div className="p-4 border border-guardian/20 rounded-lg bg-guardian/5">
            <p className="text-sm">Un SMS avec un code de vérification sera envoyé au:</p>
            <p className="font-medium mt-1">{phoneNumber || 'Numéro non défini'}</p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={onCancel} 
              variant="outline" 
              className="flex-1"
            >
              Annuler
            </Button>
            <Button 
              onClick={sendVerificationCode} 
              className="flex-1 glass-button"
              disabled={isSending || !phoneNumber}
            >
              {isSending ? 'Envoi...' : 'Envoyer le code'}
              <Send className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="smsCode">Code de vérification</Label>
            <Input
              id="smsCode"
              placeholder="Entrez le code reçu par SMS"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className="text-center text-lg letter-spacing-wide"
            />
            <p className="text-xs text-muted-foreground">
              Pour le test, utilisez le code: 1234
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => setCodeSent(false)} 
              variant="outline" 
              className="flex-1"
              disabled={isVerifying}
            >
              Retour
            </Button>
            <Button 
              onClick={verifyCode} 
              className="flex-1 glass-button"
              disabled={isVerifying || !code}
            >
              {isVerifying ? 'Vérification...' : 'Vérifier'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmsVerification;
