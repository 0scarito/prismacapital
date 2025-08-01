import React from 'react';

const blocks = Array.from({ length: 8 }, (_, i) => i);

const BlockchainCarousel = () => (
  <div className="blockchain-carousel">
    <div className="blockchain-track">
      {blocks.concat(blocks).map((i) => (
        <div key={i + Math.random()} className="blockcube">
          <div className="front flex items-center justify-center text-cyan-300 font-mono text-sm">
            #{i + 1}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default BlockchainCarousel;
