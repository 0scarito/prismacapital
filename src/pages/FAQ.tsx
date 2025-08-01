import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { ChevronDown, MessageCircle, Phone, Mail } from 'lucide-react';
import Fuse from 'fuse.js';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const findBestMatch = (query: string) => {
    if (!query) return null;
    const list: { cat: number; idx: number; q: string; a: string }[] = [];
    faqCategories.forEach((cat, c) => {
      cat.questions.forEach((q, i) => {
        list.push({ cat: c, idx: i, q: q.q, a: q.a });
      });
    });
    const fuse = new Fuse(list, {
      keys: ['q', 'a'],
      includeScore: true,
      threshold: 0.4,
    });
    const result = fuse.search(query);
    return result.length > 0 ? result[0].item : null;
  };

  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const match = findBestMatch(searchTerm);
    if (match) {
      const globalIndex = match.cat * 100 + match.idx;
      setOpenItems([globalIndex]);
      setTimeout(() => {
        document
          .getElementById(`faq-item-${globalIndex}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 0);
    } else {
      toast({
        title: t('faq.noResultsTitle'),
        description: t('faq.noResultsDescription'),
      });
    }
  };
  const toggleItem = (index: number) => {
    setOpenItems(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };
  const faqCategories = [
    {
      title: t('faq.general.title'),
      questions: [
        { q: t('faq.general.q1.q'), a: t('faq.general.q1.a') },
        { q: t('faq.general.q2.q'), a: t('faq.general.q2.a') },
        { q: t('faq.general.q3.q'), a: t('faq.general.q3.a') }
      ]
    },
    {
      title: t('faq.investments.title'),
      questions: [
        { q: t('faq.investments.q1.q'), a: t('faq.investments.q1.a') },
        { q: t('faq.investments.q2.q'), a: t('faq.investments.q2.a') },
        { q: t('faq.investments.q3.q'), a: t('faq.investments.q3.a') },
        { q: t('faq.investments.q4.q'), a: t('faq.investments.q4.a') }
      ]
    },
    {
      title: t('faq.practical.title'),
      questions: [
        { q: t('faq.practical.q1.q'), a: t('faq.practical.q1.a') },
        { q: t('faq.practical.q2.q'), a: t('faq.practical.q2.a') },
        { q: t('faq.practical.q3.q'), a: t('faq.practical.q3.a') },
        { q: t('faq.practical.q4.q'), a: t('faq.practical.q4.a') }
      ]
    },
    {
      title: t('faq.legal.title'),
      questions: [
        { q: t('faq.legal.q1.q'), a: t('faq.legal.q1.a') },
        { q: t('faq.legal.q2.q'), a: t('faq.legal.q2.a') },
        { q: t('faq.legal.q3.q'), a: t('faq.legal.q3.a') }
      ]
    }
  ];
  return <div className="min-h-screen bg-background font-sans">
      <Navigation />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="section-container">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-serif font-bold text-5xl lg:text-7xl text-warm-white mb-8 leading-tight">
                {t('faq.title')}
              </h1>
              <p className="font-sans text-xl text-light-gray mb-12 leading-relaxed">
                {t('faq.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="py-12 bg-warm-white border-b border-border/20">
          <div className="section-container">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder={t('faq.searchPlaceholder')}
                    className="w-full px-6 py-4 rounded-xl border border-border/20 bg-gradient-subtle focus:outline-none focus:ring-2 focus:ring-metallic-gold/50 text-deep-navy placeholder:text-deep-navy/60"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-deep-navy/60"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-20 bg-warm-white">
          <div className="section-container">
            <div className="max-w-4xl mx-auto">
              {faqCategories.map((category, categoryIndex) => <div key={categoryIndex} className="mb-12">
                  <h2 className="font-serif font-bold text-3xl text-deep-navy mb-8 text-center">
                    {category.title}
                  </h2>

                  <div className="space-y-4">
                    {category.questions.map((item, itemIndex) => {
                  const globalIndex = categoryIndex * 100 + itemIndex;
                  const isOpen = openItems.includes(globalIndex);
                  return <div id={`faq-item-${globalIndex}`} key={itemIndex} className="bg-gradient-subtle rounded-xl border border-border/20 overflow-hidden">
                          <button onClick={() => toggleItem(globalIndex)} className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-deep-navy/5 transition-colors">
                            <h3 className="font-sans font-medium text-lg text-deep-navy pr-4">
                              {item.q}
                            </h3>
                            <ChevronDown className={`w-5 h-5 text-metallic-gold transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isOpen && <div className="px-8 pb-6">
                              <div className="border-t border-border/20 pt-6">
                                <p className="font-sans text-deep-navy/80 leading-relaxed">
                                  {item.a}
                                </p>
                              </div>
                            </div>}
                        </div>;
                })}
                  </div>
                </div>)}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-20 bg-deep-navy">
          <div className="section-container">
            <div className="text-center mb-12">
              <h2 className="font-serif font-bold text-4xl text-warm-white mb-6">
                {t('faq.contactTitle')}
              </h2>
              <p className="font-sans text-lg text-light-gray max-w-2xl mx-auto">
                {t('faq.contactSubtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-warm-white/5 backdrop-blur-sm rounded-2xl p-8 border border-warm-white/10 text-center">
                <MessageCircle className="w-12 h-12 text-metallic-gold mx-auto mb-6" />
                <h3 className="font-serif font-bold text-xl text-warm-white mb-4">
                  {t('faq.contact.chat.title')}
                </h3>
                <p className="font-sans text-light-gray text-sm mb-6">
                  {t('faq.contact.chat.desc')}
                </p>
                <button className="btn-primary w-full">
                  {t('faq.contact.chat.btn')}
                </button>
              </div>

              <div className="bg-warm-white/5 backdrop-blur-sm rounded-2xl p-8 border border-warm-white/10 text-center">
                <Mail className="w-12 h-12 text-metallic-gold mx-auto mb-6" />
                <h3 className="font-serif font-bold text-xl text-warm-white mb-4">
                  {t('faq.contact.email.title')}
                </h3>
                <p className="font-sans text-light-gray text-sm mb-6">
                  {t('faq.contact.email.desc')}
                </p>
                <button className="btn-primary w-full">
                  {t('faq.contact.email.btn')}
                </button>
              </div>

              <div className="bg-warm-white/5 backdrop-blur-sm rounded-2xl p-8 border border-warm-white/10 text-center">
                <Phone className="w-12 h-12 text-metallic-gold mx-auto mb-6" />
                <h3 className="font-serif font-bold text-xl text-warm-white mb-4">
                  {t('faq.contact.phone.title')}
                </h3>
                <p className="font-sans text-light-gray text-sm mb-6">
                  {t('faq.contact.phone.desc')}
                </p>
                <button className="btn-primary w-full">
                  {t('faq.contact.phone.btn')}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default FAQ;