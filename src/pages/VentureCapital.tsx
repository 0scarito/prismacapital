import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const VentureCapital = () => {
  const examples = [
    {
      title: 'Early Equity',
      description: 'Get in early on ultra-innovative young startups.' ,
      timeline: ['Idea 2023', 'Seed 2024']
    },
    {
      title: 'Co-invest with VCs',
      description: 'Invest alongside renowned venture capital funds.',
      timeline: ['Seed 2022', 'Series A 2023']
    },
    {
      title: 'Flexible Tickets',
      description: 'Entry tickets from just €1,000 to democratise venture.',
      timeline: ['Opening 2023']
    },
    {
      title: 'Direct Founder Updates',
      description: 'Receive monthly video updates straight from the founders.',
      timeline: ['Launch 2024']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Venture Capital</h1>
            <div className="grid sm:grid-cols-2 gap-6">
              {examples.map((ex, idx) => (
                <Accordion key={idx} type="single" collapsible>
                  <AccordionItem value="item">
                    <AccordionTrigger className="bg-card rounded-lg p-6 border border-border shadow-prisma-card">
                      <div className="text-left">
                        <h3 className="font-serif text-lg text-foreground mb-1 font-bold">
                          {ex.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {ex.description}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="pl-4 list-disc space-y-1">
                        {ex.timeline.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer riskCategory="risk.ventureCapital" />
    </div>
  );
};

export default VentureCapital;
