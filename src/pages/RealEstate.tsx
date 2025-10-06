import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowLeft, Building, MapPin, DollarSign, Calendar, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

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

interface Floor {
  id: string;
  name: string;
  level: number;
  color: string;
  projects: Project[];
}

const RealEstate = () => {
  const { t } = useLanguage();
  const [rotation, setRotation] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<Project | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const floors: Floor[] = [
    {
      id: 'rooftop',
      name: t('realEstate.floor.rooftop'),
      level: 3,
      color: 'from-green-500 to-green-700',
      projects: [
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
        }
      ]
    },
    {
      id: 'upper',
      name: t('realEstate.floor.upper'),
      level: 2,
      color: 'from-blue-500 to-blue-700',
      projects: [
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
        }
      ]
    },
    {
      id: 'ground',
      name: t('realEstate.floor.ground'),
      level: 1,
      color: 'from-purple-500 to-purple-700',
      projects: [
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
      ]
    }
  ];
  const allProjects = floors.flatMap(floor => floor.projects);
  const totalRent = allProjects.reduce((sum, project) => {
    const value = parseFloat(project.value.replace('€', '').replace('M', ''));
    const yield_ = parseFloat(project.yield.replace('%', ''));
    return sum + value * yield_ / 100;
  }, 0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging && !selectedRoom) {
        setRotation(prev => (prev + 0.2) % 360);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isDragging, selectedRoom]);
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart;
      setRotation(prev => prev + deltaX * 0.5);
      setDragStart(e.clientX);
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
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

            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-white mb-4">
                {t('realEstate.hero.title')}
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                {t('realEstate.hero.description')}
              </p>
            </div>

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

        {/* 3D Villa */}
        <section className="py-12">
          <div className="section-container">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                {t('realEstate.villaTitle')}
              </h3>
              <p className="text-slate-400">
                {t('realEstate.villaInstructions')}
              </p>
            </div>

            {/* 3D Villa Container */}
            <div className="relative h-96 mx-auto max-w-4xl cursor-grab active:cursor-grabbing" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} style={{
            perspective: '1200px'
          }}>
              <div className="absolute inset-0 transform-gpu transition-transform" style={{
              transform: `rotateY(${rotation}deg)`,
              transformStyle: 'preserve-3d'
            }}>
                {/* Villa Structure */}
                {floors.map((floor, floorIndex) => <div key={floor.id} className={`absolute w-80 h-24 bg-gradient-to-r ${floor.color} rounded-lg border-2 border-white/30`} style={{
                bottom: `${floorIndex * 80 + 50}px`,
                left: '50%',
                transform: 'translateX(-50%)',
                transformStyle: 'preserve-3d'
              }}>
                    {/* Floor Label */}
                    <div className="absolute -left-32 top-1/2 transform -translate-y-1/2 text-white font-bold">
                      {floor.name}
                    </div>

                    {/* Room Divisions */}
                    <div className="h-full flex">
                      {floor.projects.map((project, projectIndex) => <div key={project.id} className="flex-1 relative group cursor-pointer" onClick={() => setSelectedRoom(project)}>
                          {/* Room Content */}
                          <div className="h-full p-3 flex flex-col justify-center items-center text-center text-white/90 group-hover:text-white transition-colors">
                            <div className="text-sm font-bold">{project.name}</div>
                            <div className="text-xs opacity-80">{project.yield}</div>
                          </div>

                          {/* Room Divider */}
                          {projectIndex < floor.projects.length - 1 && <div className="absolute right-0 top-2 bottom-2 w-px bg-white/30" />}

                          {/* Hover Effect */}
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded" />
                        </div>)}
                    </div>

                    {/* Floor Accent Light */}
                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                  </div>)}

                {/* Villa Base */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-12 bg-slate-800 rounded-lg border border-slate-600" />
              </div>
            </div>

            {/* Mini Map */}
            <div className="mt-8 flex justify-center">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                <div className="text-white font-bold mb-2 text-center">
                  {t('realEstate.villaLayout')}
                </div>
                <div className="flex gap-2">
                  {floors.map(floor => <div key={floor.id} className={`w-16 h-8 bg-gradient-to-r ${floor.color} rounded text-xs text-white flex items-center justify-center`}>
                      L{floor.level}
                    </div>)}
                </div>
              </div>
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

      {/* Property Dossier Modal */}
      {selectedRoom && <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">{selectedRoom.name}</h3>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedRoom.type}</span>
                </div>
              </div>
              <button onClick={() => setSelectedRoom(null)} className="text-slate-400 hover:text-white text-2xl">
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
                    <div className="text-slate-500 text-sm">{selectedRoom.photos.length} images</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {selectedRoom.photos.map((photo: string, index: number) => <div key={index} className="w-16 h-12 bg-slate-800 rounded border border-slate-600 flex items-center justify-center">
                      <span className="text-xs text-slate-500">{index + 1}</span>
                    </div>)}
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
                      <div className="text-2xl font-bold text-emerald-400">{selectedRoom.yield}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">{t('realEstate.metrics.occupancy')}</div>
                      <div className="text-2xl font-bold text-blue-400">{selectedRoom.occupancy}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">{t('realEstate.metrics.value')}</div>
                      <div className="text-2xl font-bold text-white">{selectedRoom.value}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">{t('realEstate.metrics.financing')}</div>
                      <div className="text-2xl font-bold text-orange-400">{selectedRoom.financing}%</div>
                    </div>
                  </div>
                </div>

                {/* Financing Progress */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-3">
                    {t('realEstate.financingProgress')}
                  </h4>
                  <div className="bg-slate-800 rounded-full h-4 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500" style={{
                  width: `${selectedRoom.financing}%`
                }} />
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
                  <p className="text-slate-300">{selectedRoom.description}</p>
                </div>

                <button className="w-full bg-orange-400 hover:bg-orange-500 text-slate-900 py-3 px-6 rounded-lg font-bold transition-colors">
                  {t('realEstate.invest')}
                </button>
              </div>
            </div>
          </div>
          </div>
          }

      <Footer riskCategory="risk.realEstate" />
    </div>;
  };
  export default RealEstate;