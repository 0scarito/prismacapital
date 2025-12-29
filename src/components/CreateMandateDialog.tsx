import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, FileText, Shield, AlertTriangle, Loader2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const mandateFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  total_value: z.number().min(1000, 'Minimum mandate value is €1,000'),
  coupon_count: z.number().min(1, 'At least 1 coupon required').max(10000),
  pricing_tier: z.enum(['standard', 'premium', 'enterprise']),
  risk_tolerance: z.enum(['conservative', 'moderate', 'aggressive']),
  investment_objectives: z.string().min(10, 'Please describe investment objectives').max(1000),
  start_date: z.date({ required_error: 'Start date is required' }),
  end_date: z.date().optional(),
  notes: z.string().max(2000).optional(),
  // Legal acknowledgments
  terms_accepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  risk_disclosure_accepted: z.boolean().refine(val => val === true, 'You must acknowledge the risk disclosure'),
  regulatory_compliance_confirmed: z.boolean().refine(val => val === true, 'You must confirm regulatory compliance'),
  // Product mix
  product_mix: z.object({
    real_estate: z.number().min(0).max(100).default(0),
    private_equity: z.number().min(0).max(100).default(0),
    venture_capital: z.number().min(0).max(100).default(0),
    commodities: z.number().min(0).max(100).default(0),
    crypto: z.number().min(0).max(100).default(0),
    etfs: z.number().min(0).max(100).default(0),
  }).refine(data => {
    const total = data.real_estate + data.private_equity + data.venture_capital + 
                  data.commodities + data.crypto + data.etfs;
    return total === 100;
  }, { message: 'Product mix must total 100%' }),
});

type MandateFormValues = z.infer<typeof mandateFormSchema>;

interface CreateMandateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerId: string;
  onMandateCreated: () => void;
}

const TERMS_AND_CONDITIONS = `
PRISMA CAPITAL COUPON MANDATE AGREEMENT

1. DEFINITIONS AND INTERPRETATION
This Mandate Agreement ("Agreement") is entered into between Prisma Capital SAS ("Prisma") and the Partner Organization ("Partner").

2. SCOPE OF MANDATE
The Partner authorizes Prisma to issue investment coupons on their behalf, subject to the terms herein.

3. COUPON TERMS
- Each coupon represents a fractional investment right
- Coupons are non-transferable except through Prisma's platform
- Face values are denominated in EUR

4. PARTNER OBLIGATIONS
- Maintain accurate client records
- Distribute coupons only to eligible recipients
- Comply with applicable KYC/AML regulations

5. PRISMA OBLIGATIONS
- Issue coupons within 5 business days of mandate activation
- Provide real-time reporting on coupon status
- Maintain secure custody of underlying assets

6. FEES AND PRICING
Fees are determined by the selected pricing tier and are deducted from the mandate value.

7. TERM AND TERMINATION
This mandate remains in effect until the expiry date or until terminated by either party with 30 days notice.

8. GOVERNING LAW
This Agreement is governed by French law.
`;

const RISK_DISCLOSURE = `
RISK DISCLOSURE STATEMENT

IMPORTANT: Please read this disclosure carefully before proceeding.

1. INVESTMENT RISK
All investments carry risk. The value of investments can go down as well as up, and you may receive less than your original investment.

2. MARKET RISK
Investment coupons are subject to market fluctuations and economic conditions that may adversely affect performance.

3. LIQUIDITY RISK
Some underlying investments may have limited liquidity, affecting the ability to redeem coupons.

4. REGULATORY RISK
Changes in laws or regulations may impact the value or availability of certain investment products.

5. COUNTERPARTY RISK
There is a risk that Prisma Capital or its partners may not be able to fulfill their obligations.

6. NO GUARANTEE
Past performance is not indicative of future results. Prisma Capital does not guarantee any specific investment outcomes.

By accepting this disclosure, you confirm that you understand these risks and have the financial sophistication to evaluate investment decisions.
`;

export function CreateMandateDialog({ 
  open, 
  onOpenChange, 
  partnerId, 
  onMandateCreated 
}: CreateMandateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'details' | 'products' | 'legal'>('details');
  const { toast } = useToast();

  const form = useForm<MandateFormValues>({
    resolver: zodResolver(mandateFormSchema),
    defaultValues: {
      name: '',
      description: '',
      total_value: 10000,
      coupon_count: 10,
      pricing_tier: 'standard',
      risk_tolerance: 'moderate',
      investment_objectives: '',
      notes: '',
      terms_accepted: false,
      risk_disclosure_accepted: false,
      regulatory_compliance_confirmed: false,
      product_mix: {
        real_estate: 25,
        private_equity: 25,
        venture_capital: 15,
        commodities: 15,
        crypto: 10,
        etfs: 10,
      },
    },
  });

  const productMix = form.watch('product_mix');
  const productMixTotal = Object.values(productMix).reduce((a, b) => a + b, 0);

  const onSubmit = async (data: MandateFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Generate contract reference
      const { data: contractRef, error: refError } = await supabase
        .rpc('generate_contract_reference');

      if (refError) {
        console.error('Error generating contract reference:', refError);
        throw new Error('Failed to generate contract reference');
      }

      // Create the mandate
      const { error: insertError } = await supabase
        .from('partner_mandates')
        .insert({
          partner_id: partnerId,
          name: data.name,
          description: data.description || null,
          total_value: data.total_value,
          coupon_count: data.coupon_count,
          pricing_tier: data.pricing_tier,
          risk_tolerance: data.risk_tolerance,
          investment_objectives: data.investment_objectives,
          start_date: format(data.start_date, 'yyyy-MM-dd'),
          end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : null,
          notes: data.notes || null,
          contract_reference: contractRef,
          terms_accepted_at: new Date().toISOString(),
          risk_disclosure_accepted: data.risk_disclosure_accepted,
          regulatory_compliance_confirmed: data.regulatory_compliance_confirmed,
          product_mix: data.product_mix,
          status: 'draft',
        });

      if (insertError) {
        console.error('Error creating mandate:', insertError);
        throw insertError;
      }

      toast({
        title: 'Mandate Created',
        description: `Mandate "${data.name}" has been created successfully with reference ${contractRef}.`,
      });

      form.reset();
      setStep('details');
      onOpenChange(false);
      onMandateCreated();
    } catch (error) {
      console.error('Failed to create mandate:', error);
      toast({
        title: 'Error',
        description: 'Failed to create mandate. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setStep('details');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create New Mandate
          </DialogTitle>
          <DialogDescription>
            Set up a new coupon mandate for your organization. Complete all sections to proceed.
          </DialogDescription>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-4 py-2">
          <button
            onClick={() => setStep('details')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
              step === 'details' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            1. Details
          </button>
          <div className="w-8 h-px bg-border" />
          <button
            onClick={() => setStep('products')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
              step === 'products' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            2. Products
          </button>
          <div className="w-8 h-px bg-border" />
          <button
            onClick={() => setStep('legal')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
              step === 'legal' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            3. Legal
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-[400px] pr-4">
              {step === 'details' && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mandate Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Q1 2025 Client Portfolio" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of this mandate..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="total_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Value (€) *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1000}
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coupon_count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Coupons *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1}
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Avg. value: €{(form.watch('total_value') / (field.value || 1)).toFixed(2)}/coupon
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pricing_tier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pricing Tier *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tier" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="standard">Standard (1.5% fee)</SelectItem>
                              <SelectItem value="premium">Premium (1.0% fee)</SelectItem>
                              <SelectItem value="enterprise">Enterprise (0.5% fee)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="risk_tolerance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Risk Tolerance *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select risk level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="conservative">Conservative</SelectItem>
                              <SelectItem value="moderate">Moderate</SelectItem>
                              <SelectItem value="aggressive">Aggressive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : "Pick a date"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date (Optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : "No expiry"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < (form.watch('start_date') || new Date())}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="investment_objectives"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investment Objectives *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the investment objectives for this mandate..."
                            className="resize-none min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Internal Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any internal notes for this mandate..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 'products' && (
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Product Mix Allocation</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Allocate the percentage of the mandate value across different product categories. 
                      Total must equal 100%.
                    </p>
                    <div className={cn(
                      "text-sm font-medium",
                      productMixTotal === 100 ? "text-green-600" : "text-destructive"
                    )}>
                      Current total: {productMixTotal}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="product_mix.real_estate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Real Estate (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0}
                              max={100}
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="product_mix.private_equity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Private Equity (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0}
                              max={100}
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="product_mix.venture_capital"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Venture Capital (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0}
                              max={100}
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="product_mix.commodities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Commodities (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0}
                              max={100}
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="product_mix.crypto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Crypto (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0}
                              max={100}
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="product_mix.etfs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ETFs (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0}
                              max={100}
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.formState.errors.product_mix?.root && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.product_mix.root.message}
                    </p>
                  )}
                </div>
              )}

              {step === 'legal' && (
                <div className="space-y-6">
                  {/* Terms and Conditions */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">Terms and Conditions</h4>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 max-h-[150px] overflow-y-auto text-xs font-mono whitespace-pre-wrap">
                      {TERMS_AND_CONDITIONS}
                    </div>
                    <FormField
                      control={form.control}
                      name="terms_accepted"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              I have read and accept the Terms and Conditions *
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Risk Disclosure */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <h4 className="font-medium">Risk Disclosure</h4>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 max-h-[150px] overflow-y-auto text-xs font-mono whitespace-pre-wrap">
                      {RISK_DISCLOSURE}
                    </div>
                    <FormField
                      control={form.control}
                      name="risk_disclosure_accepted"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              I acknowledge and accept the Risk Disclosure Statement *
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Regulatory Compliance */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <h4 className="font-medium">Regulatory Compliance</h4>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-sm">
                      <p className="mb-2">By confirming regulatory compliance, you attest that:</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Your organization is properly licensed to distribute investment products</li>
                        <li>You will comply with all applicable KYC/AML regulations</li>
                        <li>You will only distribute coupons to eligible clients</li>
                        <li>You will maintain proper records as required by law</li>
                      </ul>
                    </div>
                    <FormField
                      control={form.control}
                      name="regulatory_compliance_confirmed"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              I confirm regulatory compliance on behalf of my organization *
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </ScrollArea>

            <div className="flex justify-between pt-4 border-t">
              {step !== 'details' ? (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setStep(step === 'legal' ? 'products' : 'details')}
                >
                  Previous
                </Button>
              ) : (
                <Button type="button" variant="ghost" onClick={handleClose}>
                  Cancel
                </Button>
              )}

              {step !== 'legal' ? (
                <Button 
                  type="button"
                  onClick={() => setStep(step === 'details' ? 'products' : 'legal')}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Mandate
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}