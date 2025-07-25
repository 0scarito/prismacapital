const SocialProofSection = () => {
  const partners = [
    "AMF", "BNP Paribas", "Société Générale", "Crédit Agricole", 
    "LVMH", "L'Oréal", "Total Energies", "Michelin"
  ];

  return (
    <section className="py-12 bg-background border-b border-border/20">
      <div className="container mx-auto px-6">
        <p className="text-center text-light-gray/60 text-sm mb-8 font-sans">
          Trusted by regulated partners
        </p>
        
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee space-x-16 hover:pause-animation">
            {[...partners, ...partners].map((partner, index) => (
              <div 
                key={index}
                className="flex-shrink-0 text-light-gray/40 font-sans font-medium text-lg hover:text-light-gray/80 transition-colors duration-300"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default SocialProofSection;