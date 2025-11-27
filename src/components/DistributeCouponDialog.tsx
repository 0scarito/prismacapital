import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, Send } from 'lucide-react';

interface DistributeCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: {
    id: string;
    code: string;
    product_type: string;
    face_value: number;
  } | null;
  onDistribute: (couponId: string, clientRef: string, clientEmail?: string) => Promise<void>;
}

const DistributeCouponDialog = ({ open, onOpenChange, coupon, onDistribute }: DistributeCouponDialogProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [clientRef, setClientRef] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  const handleDistribute = async () => {
    if (!coupon || !clientRef.trim()) {
      toast({
        title: t('distribute.error.title') || 'Error',
        description: t('distribute.error.clientRef') || 'Please enter a client reference',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await onDistribute(coupon.id, clientRef, clientEmail || undefined);
      toast({
        title: t('distribute.success.title') || 'Coupon Distributed',
        description: t('distribute.success.desc') || `Coupon ${coupon.code} has been distributed to client ${clientRef}`,
      });
      onOpenChange(false);
      setClientRef('');
      setClientEmail('');
    } catch (error) {
      toast({
        title: t('distribute.error.title') || 'Error',
        description: t('distribute.error.failed') || 'Failed to distribute coupon',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!coupon) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('distribute.title') || 'Distribute Coupon'}</DialogTitle>
          <DialogDescription>
            {t('distribute.description') || 'Assign this coupon to one of your clients'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Coupon Info */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('distribute.product') || 'Product'}:</span>
              <span className="font-medium">{coupon.product_type}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('distribute.value') || 'Value'}:</span>
              <span className="font-medium">€{coupon.face_value.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('distribute.code') || 'Code'}:</span>
              <span className="font-mono text-xs">{coupon.code}</span>
            </div>
          </div>

          {/* Client Reference */}
          <div className="space-y-2">
            <Label htmlFor="clientRef">
              {t('distribute.clientRef.label') || 'Client Reference'}*
            </Label>
            <Input
              id="clientRef"
              value={clientRef}
              onChange={(e) => setClientRef(e.target.value)}
              placeholder={t('distribute.clientRef.placeholder') || 'e.g., CLI-12345 or client internal ID'}
              required
            />
            <p className="text-xs text-muted-foreground">
              {t('distribute.clientRef.help') || 'Your internal client identifier for tracking'}
            </p>
          </div>

          {/* Client Email (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="clientEmail">
              {t('distribute.clientEmail.label') || 'Client Email'} ({t('distribute.optional') || 'Optional'})
            </Label>
            <Input
              id="clientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="client@example.com"
            />
            <p className="text-xs text-muted-foreground">
              {t('distribute.clientEmail.help') || 'We can send the coupon code directly to your client'}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {t('distribute.cancel') || 'Cancel'}
          </Button>
          <Button onClick={handleDistribute} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('distribute.distributing') || 'Distributing...'}
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {t('distribute.confirm') || 'Distribute'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DistributeCouponDialog;
