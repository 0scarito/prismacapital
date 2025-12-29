import { useState } from 'react';
import { format } from 'date-fns';
import { 
  FileText, 
  Calendar, 
  Euro, 
  Package, 
  AlertTriangle, 
  Shield, 
  Check, 
  X,
  Loader2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { getOrganizationStatusVariant } from '@/lib/badgeStyles';

import { Json } from '@/integrations/supabase/types';

interface ProductMix {
  real_estate?: number;
  private_equity?: number;
  venture_capital?: number;
  commodities?: number;
  crypto?: number;
  etfs?: number;
}

interface Mandate {
  id: string;
  name: string | null;
  description: string | null;
  contract_reference: string | null;
  coupon_count: number;
  total_value: number;
  status: string;
  pricing_tier: string;
  risk_tolerance: string | null;
  investment_objectives: string | null;
  notes: string | null;
  created_at: string;
  start_date: string | null;
  end_date: string | null;
  expires_at: string | null;
  activated_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  terms_accepted_at: string | null;
  risk_disclosure_accepted: boolean | null;
  regulatory_compliance_confirmed: boolean | null;
  product_mix: Json | null;
}

interface MandateDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mandate: Mandate | null;
  onMandateUpdated: () => void;
}

export function MandateDetailDialog({ 
  open, 
  onOpenChange, 
  mandate,
  onMandateUpdated 
}: MandateDetailDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const { toast } = useToast();

  if (!mandate) return null;

  const handleCopyReference = () => {
    if (mandate.contract_reference) {
      navigator.clipboard.writeText(mandate.contract_reference);
      toast({
        title: 'Copied',
        description: 'Contract reference copied to clipboard',
      });
    }
  };

  const handleActivate = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('partner_mandates')
        .update({
          status: 'active',
          activated_at: new Date().toISOString(),
        })
        .eq('id', mandate.id);

      if (error) throw error;

      toast({
        title: 'Mandate Activated',
        description: 'The mandate is now active and coupons can be distributed.',
      });
      onMandateUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to activate mandate:', error);
      toast({
        title: 'Error',
        description: 'Failed to activate mandate',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!cancellationReason.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for cancellation',
        variant: 'destructive',
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('partner_mandates')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: cancellationReason,
        })
        .eq('id', mandate.id);

      if (error) throw error;

      toast({
        title: 'Mandate Cancelled',
        description: 'The mandate has been cancelled.',
      });
      setCancellationReason('');
      onMandateUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to cancel mandate:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel mandate',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const productMix = (mandate.product_mix as ProductMix) || {};
  const productMixEntries = Object.entries(productMix).filter(([_, value]) => typeof value === 'number' && value > 0);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {mandate.name || 'Unnamed Mandate'}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                {mandate.contract_reference && (
                  <button
                    onClick={handleCopyReference}
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    {mandate.contract_reference}
                    <Copy className="h-3 w-3" />
                  </button>
                )}
              </DialogDescription>
            </div>
            <Badge className={getOrganizationStatusVariant(mandate.status)}>
              {mandate.status}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4">
            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <Euro className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">€{mandate.total_value.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Value</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <Package className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{mandate.coupon_count}</div>
                  <div className="text-xs text-muted-foreground">Coupons</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <Calendar className="h-5 w-5 mx-auto mb-2 text-green-500" />
                  <div className="text-lg font-bold">{mandate.pricing_tier}</div>
                  <div className="text-xs text-muted-foreground">Pricing Tier</div>
                </div>
              </div>

              {/* Description */}
              {mandate.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{mandate.description}</p>
                </div>
              )}

              {/* Investment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Risk Tolerance</h4>
                  <Badge variant="outline" className="capitalize">
                    {mandate.risk_tolerance || 'moderate'}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Avg. Coupon Value</h4>
                  <span className="text-lg font-semibold">
                    €{(mandate.total_value / mandate.coupon_count).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Investment Objectives */}
              {mandate.investment_objectives && (
                <div>
                  <h4 className="font-medium mb-2">Investment Objectives</h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {mandate.investment_objectives}
                  </p>
                </div>
              )}

              {/* Notes */}
              {mandate.notes && (
                <div>
                  <h4 className="font-medium mb-2">Internal Notes</h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {mandate.notes}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Product Mix Allocation</h4>
                {productMixEntries.length > 0 ? (
                  <div className="space-y-4">
                    {productMixEntries.map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{key.replace('_', ' ')}</span>
                          <span className="font-medium">{value}%</span>
                        </div>
                        <Progress value={value} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          €{((mandate.total_value * (value || 0)) / 100).toLocaleString()} allocated
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No product mix defined</p>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Coupon Breakdown</h4>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Coupons:</span>
                      <span className="ml-2 font-medium">{mandate.coupon_count}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Value per Coupon:</span>
                      <span className="ml-2 font-medium">
                        €{(mandate.total_value / mandate.coupon_count).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="legal" className="space-y-6">
              {/* Compliance Status */}
              <div className="space-y-4">
                <h4 className="font-medium">Compliance Status</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>Terms & Conditions</span>
                    </div>
                    {mandate.terms_accepted_at ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="h-4 w-4" />
                        <span className="text-sm">Accepted {formatDate(mandate.terms_accepted_at)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <X className="h-4 w-4" />
                        <span className="text-sm">Not accepted</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span>Risk Disclosure</span>
                    </div>
                    {mandate.risk_disclosure_accepted ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="h-4 w-4" />
                        <span className="text-sm">Acknowledged</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <X className="h-4 w-4" />
                        <span className="text-sm">Not acknowledged</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Regulatory Compliance</span>
                    </div>
                    {mandate.regulatory_compliance_confirmed ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="h-4 w-4" />
                        <span className="text-sm">Confirmed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <X className="h-4 w-4" />
                        <span className="text-sm">Not confirmed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contract Reference */}
              <div>
                <h4 className="font-medium mb-2">Contract Reference</h4>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-3 py-2 rounded text-sm">
                    {mandate.contract_reference || 'Not assigned'}
                  </code>
                  {mandate.contract_reference && (
                    <Button variant="ghost" size="sm" onClick={handleCopyReference}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Cancellation Info */}
              {mandate.status === 'cancelled' && mandate.cancellation_reason && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <h4 className="font-medium text-destructive mb-2">Cancellation Details</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Cancelled on {formatDate(mandate.cancelled_at)}
                  </p>
                  <p className="text-sm">{mandate.cancellation_reason}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <div className="relative pl-6 border-l-2 border-muted space-y-6">
                <div className="relative">
                  <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary" />
                  <div>
                    <div className="font-medium">Mandate Created</div>
                    <div className="text-sm text-muted-foreground">{formatDate(mandate.created_at)}</div>
                  </div>
                </div>

                {mandate.terms_accepted_at && (
                  <div className="relative">
                    <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-blue-500" />
                    <div>
                      <div className="font-medium">Legal Terms Accepted</div>
                      <div className="text-sm text-muted-foreground">{formatDate(mandate.terms_accepted_at)}</div>
                    </div>
                  </div>
                )}

                {mandate.start_date && (
                  <div className="relative">
                    <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-green-500" />
                    <div>
                      <div className="font-medium">Scheduled Start Date</div>
                      <div className="text-sm text-muted-foreground">{formatDate(mandate.start_date)}</div>
                    </div>
                  </div>
                )}

                {mandate.activated_at && (
                  <div className="relative">
                    <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-green-600" />
                    <div>
                      <div className="font-medium">Mandate Activated</div>
                      <div className="text-sm text-muted-foreground">{formatDate(mandate.activated_at)}</div>
                    </div>
                  </div>
                )}

                {mandate.end_date && (
                  <div className="relative">
                    <div className={cn(
                      "absolute -left-[25px] w-4 h-4 rounded-full",
                      new Date(mandate.end_date) < new Date() ? "bg-muted" : "bg-yellow-500"
                    )} />
                    <div>
                      <div className="font-medium">End Date</div>
                      <div className="text-sm text-muted-foreground">{formatDate(mandate.end_date)}</div>
                    </div>
                  </div>
                )}

                {mandate.cancelled_at && (
                  <div className="relative">
                    <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-destructive" />
                    <div>
                      <div className="font-medium text-destructive">Mandate Cancelled</div>
                      <div className="text-sm text-muted-foreground">{formatDate(mandate.cancelled_at)}</div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          <div className="flex gap-2">
            {mandate.status === 'draft' && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isUpdating}>
                      Cancel Mandate
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Mandate?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. The mandate will be permanently cancelled.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <Textarea
                        placeholder="Please provide a reason for cancellation..."
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Mandate</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancel} className="bg-destructive hover:bg-destructive/90">
                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Cancel Mandate
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button onClick={handleActivate} disabled={isUpdating}>
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Activate Mandate
                </Button>
              </>
            )}

            {mandate.status === 'active' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isUpdating}>
                    Cancel Mandate
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Active Mandate?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will cancel an active mandate. Any undistributed coupons will be voided.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <Textarea
                      placeholder="Please provide a reason for cancellation..."
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Mandate</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel} className="bg-destructive hover:bg-destructive/90">
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Cancel Mandate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}