import { useState } from 'react';
import { Plus } from 'lucide-react';

interface InvestmentCardProps {
  title: string;
  description: string;
  image?: string;
  onAdd: () => void;
}

const InvestmentCard = ({ title, description, image, onAdd }: InvestmentCardProps) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col">
      <div className="w-full h-32 bg-slate-200 rounded mb-4 overflow-hidden flex items-center justify-center">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-slate-500 text-sm">Image Placeholder</span>
        )}
      </div>
      <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
      {showMore ? (
        <p className="text-sm text-slate-600 flex-1">{description}</p>
      ) : (
        <p className="text-sm text-slate-600 flex-1">
          {description.slice(0, 80)}
          {description.length > 80 ? '...' : ''}
        </p>
      )}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showMore ? 'Less' : 'More'}
        </button>
        <button
          onClick={onAdd}
          className="bg-metallic-gold text-deep-navy px-3 py-1 rounded flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};

export default InvestmentCard;

