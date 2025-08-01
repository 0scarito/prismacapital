import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React from 'react';

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  exploreLabel: string;
}

const CategoryCard = ({ title, description, href, icon, exploreLabel }: CategoryCardProps) => (
  <Link to={href} className="group focus:outline-none">
    <Card className="bg-gradient-subtle rounded-2xl p-8 border border-border/20 hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:scale-105 cursor-pointer">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          {icon}
        </div>
        <h3 className="font-serif font-bold text-xl text-deep-navy mb-4 group-hover:text-metallic-gold transition-colors">
          {title}
        </h3>
        <p className="font-sans text-deep-navy/80 mb-6 leading-relaxed">
          {description}
        </p>
        <Button aria-label={exploreLabel} className="w-full btn-primary">
          {exploreLabel}
        </Button>
      </div>
    </Card>
  </Link>
);

export default CategoryCard;
