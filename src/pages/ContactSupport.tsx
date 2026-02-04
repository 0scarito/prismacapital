import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, Clock, MessageSquare, Send } from 'lucide-react';
import { z } from 'zod';

const ContactSupport = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const contactSchema = z.object({
    name: z.string().min(2, t('support.contact.validation.name')).max(100),
    email: z.string().email(t('support.contact.validation.email')).max(255),
    subject: z.string().min(1, t('support.contact.validation.subject')),
    message: z.string().min(10, t('support.contact.validation.message')).max(2000),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: t('support.contact.validationError'),
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: t('support.contact.successTitle'),
      description: t('support.contact.successDescription'),
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('footer.contactSupport')}
            </h1>
            <p className="text-foreground/70 mb-8">
              {t('support.contact.subtitle')}
            </p>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      {t('support.contact.sendMessage')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t('support.contact.fullName')} *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={t('support.contact.fullNamePlaceholder')}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t('support.contact.email')} *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder={t('support.contact.emailPlaceholder')}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">{t('support.contact.subject')} *</Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) => setFormData({ ...formData, subject: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('support.contact.subjectPlaceholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="account">{t('support.contact.subjects.account')}</SelectItem>
                            <SelectItem value="payment">{t('support.contact.subjects.payment')}</SelectItem>
                            <SelectItem value="investment">{t('support.contact.subjects.investment')}</SelectItem>
                            <SelectItem value="cashout">{t('support.contact.subjects.cashout')}</SelectItem>
                            <SelectItem value="gift">{t('support.contact.subjects.gift')}</SelectItem>
                            <SelectItem value="technical">{t('support.contact.subjects.technical')}</SelectItem>
                            <SelectItem value="partnership">{t('support.contact.subjects.partnership')}</SelectItem>
                            <SelectItem value="other">{t('support.contact.subjects.other')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">{t('support.contact.message')} *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder={t('support.contact.messagePlaceholder')}
                          rows={6}
                          required
                        />
                        <p className="text-xs text-card-foreground/60">
                          {formData.message.length}/2000 {t('support.contact.characters')}
                        </p>
                      </div>

                      <Button type="submit" size="lg" className="w-full" disabled={loading}>
                        {loading ? (
                          t('support.contact.sending')
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            {t('support.contact.sendButton')}
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-card-foreground">{t('support.contact.email')}</h3>
                        <p className="text-card-foreground/70 text-sm">
                          support@prismacapital.fr
                        </p>
                        <p className="text-card-foreground/70 text-sm">
                          partenariat@prismacapital.fr
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-card-foreground">{t('support.contact.phone')}</h3>
                        <p className="text-card-foreground/70 text-sm">
                          +33 1 23 45 67 89
                        </p>
                        <p className="text-xs text-card-foreground/60 mt-1">
                          {t('support.contact.noSurcharge')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-card-foreground">{t('support.contact.hours')}</h3>
                        <p className="text-card-foreground/70 text-sm">
                          {t('support.contact.weekdays')}
                        </p>
                        <p className="text-card-foreground/70 text-sm">
                          {t('support.contact.timeRange')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2 text-card-foreground">{t('support.contact.responseTime')}</h3>
                    <p className="text-sm text-card-foreground/70">
                      {t('support.contact.responsePromise')}
                      <strong className="text-card-foreground"> 24-48 </strong>
                      {t('support.contact.businessHours')}.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2 text-card-foreground">{t('support.contact.postalAddress')}</h3>
                    <p className="text-sm text-card-foreground/70">
                      Prisma Capital Cards SAS<br />
                      25 Avenue des Champs-Élysées<br />
                      75008 Paris, France
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactSupport;
