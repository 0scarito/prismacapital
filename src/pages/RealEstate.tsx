import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowLeft, Building, MapPin, DollarSign, Calendar, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Project {
  id: number;
  name: string;
  type: string;
  yield: string;
  occupancy: string;
  financing: number;
  value: string;
  photos: string[];
  description: string;
}

const RealEstate = () => {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const allProjects: Project[] = [
    {
      id: 1,
      name: 'Solar Park Berlin',
      type: 'Green Energy',
      yield: '8.2%',
      occupancy: '100%',
      financing: 85,
      value: '€2.4M',
      photos: ['solar1.jpg', 'solar2.jpg'],
      description: t('realEstate.project.solarPark')
    },
    {
      id: 2,
      name: 'Luxury Apartments Munich',
      type: 'Residential',
      yield: '6.8%',
      occupancy: '95%',
      financing: 78,
      value: '€8.7M',
      photos: ['apt1.jpg', 'apt2.jpg', 'apt3.jpg'],
      description: t('realEstate.project.luxuryApts')
    },
    {
      id: 3,
      name: 'Student Housing Frankfurt',
      type: 'Residential',
      yield: '7.4%',
      occupancy: '100%',
      financing: 92,
      value: '€5.2M',
      photos: ['student1.jpg', 'student2.jpg'],
      description: t('realEstate.project.studentHousing')
    },
    {
      id: 4,
      name: 'Retail Center Hamburg',
      type: 'Commercial',
      yield: '9.1%',
      occupancy: '88%',
      financing: 67,
      value: '€12.3M',
      photos: ['retail1.jpg', 'retail2.jpg'],
      description: t('realEstate.project.retailCenter')
    },
    {
      id: 5,
      name: 'Office Complex Düsseldorf',
      type: 'Office',
      yield: '7.9%',
      occupancy: '92%',
      financing: 73,
      value: '€15.6M',
      photos: ['office1.jpg', 'office2.jpg', 'office3.jpg'],
      description: t('realEstate.project.officeComplex')
    }
  ];
  const totalRent = allProjects.reduce((sum, project) => {
    const value = parseFloat(project.value.replace('€', '').replace('M', ''));
    const yield_ = parseFloat(project.yield.replace('%', ''));
    return sum + value * yield_ / 100;
  }, 0);
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <Navigation />
      
      <main className="pt-24">
        {/* Hero */}
        <section className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 py-8 mb-12">
          <div className="section-container">
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="bg-white text-primary hover:bg-white/90 border-primary/20 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('realEstate.back')}
            </Button>

            <h1 className="text-4xl font-bold mb-8 text-center text-white">
              {t('realEstate.hero.title')}
            </h1>

            <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-300">7.8%</div>
                <div className="text-sm text-slate-300 mt-1">Projected CAGR</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-300">€44.2M</div>
                <div className="text-sm text-slate-300 mt-1">Total Invested</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-300">+31.4%</div>
                <div className="text-sm text-slate-300 mt-1">2-Year Gains</div>
              </div>
            </div>

            {/* Rent Ticker */}
            <div className="flex justify-center mt-8">
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-orange-400/30">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-orange-400 rounded-full animate-heartbeat" />
                  <div>
                    <div className="text-sm text-slate-400">
                      {t('realEstate.hero.rentalIncome')}
                    </div>
                    <div className="text-2xl font-bold text-orange-400">
                      €{totalRent.toFixed(1)}M
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Opportunities */}
        <section className="py-12">
          <div className="section-container">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              {t('realEstate.availableProjects')}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((project) => (
                <Card 
                  key={project.id}
                  className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer group"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{project.type}</span>
                        </div>
                      </div>
                      <Building className="w-8 h-8 text-emerald-400" />
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-slate-400 text-xs mb-1">Yield</div>
                        <div className="text-emerald-400 font-bold text-lg">{project.yield}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-xs mb-1">Occupancy</div>
                        <div className="text-blue-400 font-bold text-lg">{project.occupancy}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-xs mb-1">Value</div>
                        <div className="text-white font-bold text-lg">{project.value}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-xs mb-1">Financing</div>
                        <div className="text-orange-400 font-bold text-lg">{project.financing}%</div>
                      </div>
                    </div>

                    {/* Financing Progress Bar */}
                    <div className="mb-4">
                      <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500"
                          style={{ width: `${project.financing}%` }}
                        />
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{project.photos.length} photos</span>
                      <div className="flex items-center gap-1 text-emerald-400 group-hover:gap-2 transition-all">
                        <span>View Details</span>
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Key Metrics Banner */}
        <section className="py-12 bg-gradient-to-r from-orange-900/30 to-amber-900/30 mb-8">
          <div className="section-container">
            <h3 className="text-2xl font-bold text-center text-white mb-8">
              {t('realEstate.portfolioStats.title')}
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 text-center">
                <Building className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{allProjects.length}</div>
                <div className="text-slate-400 text-sm">
                  {t('realEstate.portfolioStats.projects')}
                </div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 text-center">
                <DollarSign className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">7.8%</div>
                <div className="text-slate-400 text-sm">
                  {t('realEstate.portfolioStats.averageYield')}
                </div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">93%</div>
                <div className="text-slate-400 text-sm">
                  {t('realEstate.portfolioStats.occupancyRate')}
                </div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 text-center">
                <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">78%</div>
                <div className="text-slate-400 text-sm">
                  {t('realEstate.portfolioStats.averageFinancing')}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Property Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">{selectedProject.name}</h3>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedProject.type}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProject(null)} 
                className="text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Photo Carousel */}
              <div className="space-y-4">
                <div className="bg-slate-800 rounded-xl aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Building className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <div className="text-slate-400">Property Photos</div>
                    <div className="text-slate-500 text-sm">{selectedProject.photos.length} images</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {selectedProject.photos.map((photo: string, index: number) => (
                    <div 
                      key={index} 
                      className="w-16 h-12 bg-slate-800 rounded border border-slate-600 flex items-center justify-center"
                    >
                      <span className="text-xs text-slate-500">{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-white mb-4">
                    {t('realEstate.keyMetrics')}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-slate-400 text-sm">{t('realEstate.metrics.yield')}</div>
                      <div className="text-2xl font-bold text-emerald-400">{selectedProject.yield}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">{t('realEstate.metrics.occupancy')}</div>
                      <div className="text-2xl font-bold text-blue-400">{selectedProject.occupancy}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">{t('realEstate.metrics.value')}</div>
                      <div className="text-2xl font-bold text-white">{selectedProject.value}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">{t('realEstate.metrics.financing')}</div>
                      <div className="text-2xl font-bold text-orange-400">{selectedProject.financing}%</div>
                    </div>
                  </div>
                </div>

                {/* Financing Progress */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-3">
                    {t('realEstate.financingProgress')}
                  </h4>
                  <div className="bg-slate-800 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500" 
                      style={{ width: `${selectedProject.financing}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-slate-400 mt-2">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white mb-3">
                    {t('realEstate.description')}
                  </h4>
                  <p className="text-slate-300">{selectedProject.description}</p>
                </div>

                <button className="w-full bg-orange-400 hover:bg-orange-500 text-slate-900 py-3 px-6 rounded-lg font-bold transition-colors">
                  {t('realEstate.invest')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer riskCategory="risk.realEstate" />
    </div>;
  };
  export default RealEstate;