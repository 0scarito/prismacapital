import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Package, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const distributionSchema = z.object({
  mandateId: z.string().min(1, 'Please select a mandate'),
  distributedToRef: z.string().min(1, 'Client reference is required').max(100),
  quantity: z.number().min(1, 'At least 1 coupon required'),
});

type DistributionFormValues = z.infer<typeof distributionSchema>;

interface Mandate {
  id: string;
  name: string | null;
  status: string;
}

interface Coupon {
  id: string;
  code: string;
  face_value: number;
  status: string;
  product_type: string;
  distributed_to_ref: string | null;
  distributed_at: string | null;
}

interface DistributeCouponsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerId: string;
  onDistributed: () => void;
}

export function DistributeCouponsDialog({
  open,
  onOpenChange,
  partnerId,
  onDistributed,
}: DistributeCouponsDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mandates, setMandates] = useState<Mandate[]>([]);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [distributedCoupons, setDistributedCoupons] = useState<Coupon[]>([]);
  const { toast } = useToast();

  const form = useForm<DistributionFormValues>({
    resolver: zodResolver(distributionSchema),
    defaultValues: {
      mandateId: '',
      distributedToRef: '',
      quantity: 1,
    },
  });

  const selectedMandateId = form.watch('mandateId');
  const quantity = form.watch('quantity');

  // Fetch active mandates
  useEffect(() => {
    const fetchMandates = async () => {
      const { data, error } = await supabase
        .from('partner_mandates')
        .select('id, name, status')
        .eq('partner_id', partnerId)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching mandates:', error);
        return;
      }
      setMandates(data || []);
    };

    if (open && partnerId) {
      fetchMandates();
    }
  }, [open, partnerId]);

  // Fetch available coupons when mandate is selected
  useEffect(() => {
    const fetchCoupons = async () => {
      if (!selectedMandateId) {
        setAvailableCoupons([]);
        return;
      }

      setLoadingCoupons(true);
      const { data, error } = await supabase
        .from('partner_coupons')
        .select('*')
        .eq('mandate_id', selectedMandateId)
        .eq('status', 'in_stock')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching coupons:', error);
        setAvailableCoupons([]);
      } else {
        setAvailableCoupons(data || []);
      }
      setLoadingCoupons(false);
    };

    fetchCoupons();
  }, [selectedMandateId]);

  const onSubmit = async (data: DistributionFormValues) => {
    if (data.quantity > availableCoupons.length) {
      toast({
        title: 'Not enough coupons',
        description: `Only ${availableCoupons.length} coupons available for distribution.`,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the coupons to distribute
      const couponsToDistribute = availableCoupons.slice(0, data.quantity);
      const couponIds = couponsToDistribute.map(c => c.id);

      // Update the coupons to distributed status
      const { error } = await supabase
        .from('partner_coupons')
        .update({
          status: 'distributed',
          distributed_to_ref: data.distributedToRef,
          distributed_at: new Date().toISOString(),
        })
        .in('id', couponIds);

      if (error) throw error;

      // Set distributed coupons for display
      setDistributedCoupons(couponsToDistribute.map(c => ({
        ...c,
        status: 'distributed',
        distributed_to_ref: data.distributedToRef,
        distributed_at: new Date().toISOString(),
      })));

      toast({
        title: 'Coupons Distributed',
        description: `${data.quantity} coupon(s) distributed to ${data.distributedToRef}.`,
      });

      // Refresh available coupons
      setAvailableCoupons(prev => prev.slice(data.quantity));
      form.reset({ mandateId: data.mandateId, distributedToRef: '', quantity: 1 });
      onDistributed();
    } catch (error) {
      console.error('Error distributing coupons:', error);
      toast({
        title: 'Error',
        description: 'Failed to distribute coupons. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setDistributedCoupons([]);
    setAvailableCoupons([]);
    onOpenChange(false);
  };

  const totalValue = availableCoupons
    .slice(0, Math.min(quantity, availableCoupons.length))
    .reduce((sum, c) => sum + Number(c.face_value), 0);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Distribute Coupons
          </DialogTitle>
          <DialogDescription>
            Distribute coupons to your clients. Select a mandate and specify the client reference.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="mandateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Mandate *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an active mandate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mandates.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No active mandates available
                        </SelectItem>
                      ) : (
                        mandates.map((mandate) => (
                          <SelectItem key={mandate.id} value={mandate.id}>
                            {mandate.name || 'Unnamed Mandate'}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedMandateId && (
              <>
                {loadingCoupons ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">Loading coupons...</span>
                  </div>
                ) : availableCoupons.length === 0 ? (
                  <div className="flex items-center justify-center py-4 text-muted-foreground">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    No coupons available for distribution in this mandate.
                  </div>
                ) : (
                  <>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary" />
                          <span className="font-medium">{availableCoupons.length} coupons available</span>
                        </div>
                        <Badge variant="outline">
                          €{availableCoupons.reduce((sum, c) => sum + Number(c.face_value), 0).toLocaleString()} total
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="distributedToRef"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client Reference *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., client email or ID" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Email or unique identifier for the client
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min={1}
                                max={availableCoupons.length}
                                {...field}
                                onChange={e => field.onChange(Math.min(Number(e.target.value), availableCoupons.length))}
                              />
                            </FormControl>
                            <FormDescription>
                              Value: €{totalValue.toLocaleString()}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* Recently Distributed */}
            {distributedCoupons.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Recently Distributed
                </h4>
                <ScrollArea className="h-[150px] border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Distributed To</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {distributedCoupons.map((coupon) => (
                        <TableRow key={coupon.id}>
                          <TableCell className="font-mono text-sm">{coupon.code}</TableCell>
                          <TableCell>€{Number(coupon.face_value).toLocaleString()}</TableCell>
                          <TableCell>{coupon.distributed_to_ref}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || availableCoupons.length === 0 || !selectedMandateId}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Send className="mr-2 h-4 w-4" />
                Distribute {quantity} Coupon{quantity > 1 ? 's' : ''}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}