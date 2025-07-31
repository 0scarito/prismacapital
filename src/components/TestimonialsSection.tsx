import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Marie Dubois",
      age: 68,
      location: "Lyon",
      quote: "I gave my grandson Thomas a Prisma Capital card for his 16th birthday. Now he calls me every week to tell me about the clean-tech companies he's backing. It's brought us closer together.",
      image: "/api/placeholder/80/80"
    },
    {
      name: "Jean-Pierre Martin", 
      age: 72,
      location: "Bordeaux",
      quote: "Finally, a gift that teaches my granddaughter about investing while supporting French innovation. She's learning so much about business and sustainability.",
      image: "/api/placeholder/80/80"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-4xl lg:text-6xl text-card-foreground mb-6">
            What Our Families Say
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${
                index === currentTestimonial 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 absolute inset-0 translate-y-4'
              }`}
            >
              <div className="bg-gradient-subtle rounded-2xl p-8 lg:p-12 shadow-card border border-border/20">
                <Quote className="w-12 h-12 text-secondary mb-6 mx-auto" />
                
                <blockquote className="font-sans text-xl lg:text-2xl text-card-foreground text-center leading-relaxed mb-8">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center justify-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-secondary"
                  />
                  <div className="text-center">
                    <div className="font-semibold text-card-foreground text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-muted-foreground">
                      Age {testimonial.age}, {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? 'bg-primary w-8' : 'bg-border w-2'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;