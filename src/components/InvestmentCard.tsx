import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface InvestmentCardProps {
  id: string;
  title: string;
  description: string;
  type: string;
  image?: string;
  price?: number;
  currency?: string;
  onAdd?: () => void;
}

const InvestmentCard = ({ id, title, description, type, image, price = 1.00, currency = 'EUR', onAdd }: InvestmentCardProps) => {
  const [showMore, setShowMore] = useState(false);
  const { addItem, items } = useCart();
  const isInCart = items.some(item => item.id === id);

  const handleAdd = () => {
    if (!isInCart) {
      addItem({ id, name: title, description, type, image });
    }
    if (onAdd) {
      onAdd();
    }
  };

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
      
      {/* Price Display */}
      <div className="mb-3 pb-3 border-b border-slate-200">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            {currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency}
            {price.toFixed(2)}
          </span>
          <span className="text-xs text-slate-500">per unit</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">€1 = 1 unit</p>
      </div>
      
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
          onClick={handleAdd}
          disabled={isInCart}
          className={`px-3 py-1 rounded flex items-center gap-1 transition-colors ${
            isInCart 
              ? 'bg-green-500 text-white cursor-default' 
              : 'bg-metallic-gold text-deep-navy hover:bg-metallic-gold/90'
          }`}
        >
          {isInCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isInCart ? 'Added' : 'Add'}</span>
        </button>
      </div>
    </div>
  );
};

export default InvestmentCard;

