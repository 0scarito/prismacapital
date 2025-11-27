import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building, Mail, User, DollarSign, Loader2 } from 'lucide-react';

const RequestMandate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    contactEmail: '',
    companyType: '',
    estimatedVolume: '',
    productInterests: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: t('requestMandate.success.title') || 'Request Submitted',
        description: t('requestMandate.success.desc') || 'Our team will contact you within 24 hours to discuss your mandate.',
      });
      setLoading(false);
      navigate('/partners');
    }, 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="font-serif font-bold text-4xl lg:text-5xl text-foreground mb-4">
                {t('requestMandate.title') || 'Request a Distribution Mandate'}
              </h1>
              <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('requestMandate.subtitle') || 'Fill out the form below and our partnership team will contact you to create a personalized mandate.'}
              </p>
            </div>

            {/* Form Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('requestMandate.form.title') || 'Partnership Information'}</CardTitle>
                <CardDescription>
                  {t('requestMandate.form.desc') || 'Tell us about your organization and distribution needs'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Name */}
                  <div className="space-y-2">
                    <Label htmlFor="companyName">
                      <Building className="w-4 h-4 inline mr-2" />
                      {t('requestMandate.form.companyName') || 'Company Name'}*
                    </Label>
                    <Input
                      id="companyName"
                      required
                      value={formData.companyName}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                      placeholder="Acme Financial Group"
                    />
                  </div>

                  {/* Contact Person */}
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">
                      <User className="w-4 h-4 inline mr-2" />
                      {t('requestMandate.form.contactPerson') || 'Contact Person'}*
                    </Label>
                    <Input
                      id="contactPerson"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => handleChange('contactPerson', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Contact Email */}
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">
                      <Mail className="w-4 h-4 inline mr-2" />
                      {t('requestMandate.form.email') || 'Email Address'}*
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      required
                      value={formData.contactEmail}
                      onChange={(e) => handleChange('contactEmail', e.target.value)}
                      placeholder="john@acmefinancial.com"
                    />
                  </div>

                  {/* Company Type */}
                  <div className="space-y-2">
                    <Label htmlFor="companyType">
                      {t('requestMandate.form.companyType') || 'Organization Type'}*
                    </Label>
                    <Select value={formData.companyType} onValueChange={(value) => handleChange('companyType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('requestMandate.form.selectType') || 'Select type...'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">Bank</SelectItem>
                        <SelectItem value="insurance">Insurance Company</SelectItem>
                        <SelectItem value="wealth_manager">Wealth Manager</SelectItem>
                        <SelectItem value="family_office">Family Office</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Estimated Volume */}
                  <div className="space-y-2">
                    <Label htmlFor="estimatedVolume">
                      <DollarSign className="w-4 h-4 inline mr-2" />
                      {t('requestMandate.form.volume') || 'Estimated Volume'}*
                    </Label>
                    <Select value={formData.estimatedVolume} onValueChange={(value) => handleChange('estimatedVolume', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('requestMandate.form.selectVolume') || 'Select volume...'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100k">€100,000 - €500,000</SelectItem>
                        <SelectItem value="500k">€500,000 - €1,000,000</SelectItem>
                        <SelectItem value="1m">€1,000,000 - €5,000,000</SelectItem>
                        <SelectItem value="5m+">€5,000,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Product Interests */}
                  <div className="space-y-2">
                    <Label htmlFor="productInterests">
                      {t('requestMandate.form.products') || 'Product Interests'}
                    </Label>
                    <Input
                      id="productInterests"
                      value={formData.productInterests}
                      onChange={(e) => handleChange('productInterests', e.target.value)}
                      placeholder="e.g., Real Estate, Private Equity, Commodities"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {t('requestMandate.form.message') || 'Additional Information'}
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder={t('requestMandate.form.messagePlaceholder') || 'Tell us about your distribution network and specific requirements...'}
                      rows={4}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('requestMandate.form.submitting') || 'Submitting...'}
                      </>
                    ) : (
                      t('requestMandate.form.submit') || 'Submit Request'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Info Box */}
            <div className="mt-8 p-6 bg-muted rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                {t('requestMandate.info.title') || 'What Happens Next?'}
              </h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. {t('requestMandate.info.step1') || 'Our team reviews your request within 24 hours'}</li>
                <li>2. {t('requestMandate.info.step2') || 'We schedule a call to discuss your specific needs'}</li>
                <li>3. {t('requestMandate.info.step3') || 'We create a customized mandate proposal'}</li>
                <li>4. {t('requestMandate.info.step4') || 'Upon approval, you receive access to your partner portal'}</li>
              </ol>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RequestMandate;
