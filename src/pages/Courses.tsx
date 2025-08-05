import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Book, Clock, Play, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const Courses = () => {
  const { t } = useLanguage();

  const courses = [
    {
      id: 'basics',
      title: t('courses.basics.title'),
      description: t('courses.basics.description'),
      category: t('courses.category.beginner'),
      duration: 45,
      lessons: 8,
      progress: 0,
      icon: <Book className="w-6 h-6" />
    },
    {
      id: 'portfolio',
      title: t('courses.portfolio.title'),
      description: t('courses.portfolio.description'),
      category: t('courses.category.intermediate'),
      duration: 60,
      lessons: 12,
      progress: 35,
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      id: 'startups',
      title: t('courses.startups.title'),
      description: t('courses.startups.description'),
      category: t('courses.category.advanced'),
      duration: 90,
      lessons: 15,
      progress: 100,
      icon: <Play className="w-6 h-6" />
    }
  ];

  const getCategoryColor = (category: string) => {
    if (category === t('courses.category.beginner')) return 'bg-green-100 text-green-800';
    if (category === t('courses.category.intermediate')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="section-container">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-serif font-bold text-5xl lg:text-7xl text-warm-white mb-8 leading-tight">
                {t('courses.hero.title')}
              </h1>
              <p className="font-sans text-xl text-light-gray mb-12 leading-relaxed">
                {t('courses.hero.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section className="py-20 bg-warm-white">
          <div className="section-container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Card key={course.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        {course.icon}
                      </div>
                      <Badge variant="secondary" className={getCategoryColor(course.category)}>
                        {course.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-serif text-deep-navy">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-deep-navy/70">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Course Stats */}
                      <div className="flex items-center gap-4 text-sm text-deep-navy/60">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration} {t('courses.minutes')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Book className="w-4 h-4" />
                          <span>{course.lessons} {t('courses.lessons')}</span>
                        </div>
                      </div>

                      {/* Progress */}
                      {course.progress > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-deep-navy/60">{t('courses.progress')}</span>
                            <span className="text-deep-navy/60">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      )}

                      {/* Action Button */}
                      <Button 
                        className="w-full" 
                        variant={course.progress === 100 ? "outline" : "default"}
                      >
                        {course.progress === 100 
                          ? t('courses.completed')
                          : course.progress > 0 
                            ? `${t('courses.progress')}: ${course.progress}%`
                            : t('courses.start')
                        }
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;