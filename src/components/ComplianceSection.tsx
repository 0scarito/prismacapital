const ComplianceSection = () => {
  return (
    <section className="py-12 bg-deep-navy border-t border-border/20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center">
          <p className="font-sans text-sm text-light-gray/70 leading-relaxed max-w-4xl mx-auto">
            Cap&CO is not a financial intermediary. Equity subscriptions are executed by [Partner-Name], 
            a Crowdfunding Service Provider authorised by the AMF (FR-202X-XX). Investments in start-ups 
            are illiquid and may result in total loss of capital.{' '}
            <a href="#" className="text-primary hover:text-primary/80 transition-colors underline">
              Learn more
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComplianceSection;