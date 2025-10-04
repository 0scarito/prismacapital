import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Gift } from 'lucide-react';

interface GiftTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseId: string;
  investmentName: string;
}

const GiftTransferDialog = ({ open, onOpenChange, purchaseId, investmentName }: GiftTransferDialogProps) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSendGift = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase.from('gift_transfers' as any).insert({
        from_user_id: user.id,
        to_email: email,
        purchase_id: purchaseId,
        message: message || null,
        status: 'pending',
      } as any);

      if (error) throw error;

      toast({
        title: t('dashboard.gift.success'),
        description: t('dashboard.gift.successDescription'),
      });

      setEmail('');
      setMessage('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send gift. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            {t('dashboard.gift.title')}
          </DialogTitle>
          <DialogDescription>
            {t('dashboard.gift.description')}: {investmentName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="recipient-email">{t('dashboard.gift.emailLabel')}</Label>
            <Input
              id="recipient-email"
              type="email"
              placeholder={t('dashboard.gift.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="gift-message">{t('dashboard.gift.messageLabel')}</Label>
            <Textarea
              id="gift-message"
              placeholder={t('dashboard.gift.messagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendGift} disabled={loading}>
            {loading ? 'Sending...' : t('dashboard.gift.send')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GiftTransferDialog;
