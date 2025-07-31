import React from 'react';
const Building = () => (
  <div className="relative w-32 h-32 mx-auto perspective-100">
    {[1,2,3,4].map((f,i) => (
      <div
        key={i}
        className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-20 h-6 bg-metallic-gold/20 border border-metallic-gold rounded-sm rotate-x-45 animate-heartbeat"
        style={{ bottom: `${i * 1.5}rem` }}
      />
    ))}
  </div>
);

export default Building;
