import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { CreditCard, Euro, Gift, User, Mail, Phone, MapPin } from 'lucide-react';

const Payment = () => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France'
  });

  const presetAmounts = [50, 100, 200, 500];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getCurrentAmount = () => {
    return selectedAmount || parseInt(customAmount) || 0;
  };

  const canProceedToNext = () => {
    if (currentStep === 1) return getCurrentAmount() >= 50;
    if (currentStep === 2) return formData.firstName && formData.lastName && formData.email;
    return false;
  };

  const nextStep = () => {
    if (canProceedToNext() && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="section-container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif font-bold text-4xl lg:text-6xl text-foreground mb-6">
              {t('payment.title')}
            </h1>
            <p className="font-sans text-xl text-muted-foreground">
              {t('payment.subtitle')}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step <= currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 transition-colors ${
                      step < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
            {/* Step 1: Amount Selection */}
            {currentStep === 1 && (
              <div>
                <div className="text-center mb-8">
                  <Euro className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="font-serif text-2xl text-card-foreground mb-2">
                    {t('payment.chooseAmount')}
                  </h2>
                  <p className="text-muted-foreground">
                    {t('payment.minimum')}
                  </p>
                </div>

                {/* Preset Amounts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`p-4 rounded-lg border-2 font-medium transition-all ${
                        selectedAmount === amount
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      €{amount}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    {t('payment.customAmount')}
                  </label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="number"
                      min="50"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      placeholder="50"
                      className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: User Details */}
            {currentStep === 2 && (
              <div>
                <div className="text-center mb-8">
                  <User className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="font-serif text-2xl text-card-foreground mb-2">
                    {t('payment.yourInfo')}
                  </h2>
                  <p className="text-muted-foreground">
                    {t('payment.kyc')}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      {t('payment.firstName')} *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      {t('payment.lastName')} *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      {t('payment.phone')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div>
                <div className="text-center mb-8">
                  <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="font-serif text-2xl text-card-foreground mb-2">
                    {t('payment.payment')}
                  </h2>
                  <p className="text-muted-foreground">
                    {t('payment.completePurchase')}
                  </p>
                </div>

                {/* Order Summary */}
                <div className="bg-muted/50 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-card-foreground mb-4">
                    {t('payment.orderSummary')}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t('payment.giftCoupon')}</span>
                      <span>€{getCurrentAmount()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('payment.processingFee')}</span>
                      <span>€0</span>
                    </div>
                    <div className="border-t pt-2 font-semibold flex justify-between">
                      <span>Total</span>
                      <span>€{getCurrentAmount()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                  <button className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    {t('payment.payStripe')}
                  </button>
                  <button className="w-full bg-secondary text-secondary-foreground py-4 rounded-lg font-medium hover:bg-secondary/90 transition-colors">
                    {t('payment.payPaypal')}
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                }`}
              >
                {t('payment.previous')}
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceedToNext()}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    canProceedToNext()
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {t('payment.next')}
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payment;