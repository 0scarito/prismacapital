import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

interface MapData {
  share: string;
  change: string;
}

interface WorldMapProps {
  highlight?: string;
  data?: Record<string, MapData>;
}

const geoUrl = 'https://unpkg.com/world-atlas@1/world/110m.json';

const copper = '#C87437';

const WorldMap = ({ highlight, data = {} }: WorldMapProps) => {
  const [hoverIso, setHoverIso] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; iso: string } | null>(null);

  return (
    <div className="relative w-full h-[18rem]">
      <ComposableMap projectionConfig={{ scale: 90 }} className="w-full h-full">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const iso = geo.properties.ISO_A3 as string;
              const isActive =
                iso === highlight || iso === hoverIso;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isActive ? copper : '#DDD'}
                  stroke="#888"
                  onMouseEnter={(e) => {
                    setHoverIso(iso);
                    const rect = (e.target as SVGPathElement).getBoundingClientRect();
                    setTooltip({ x: rect.x + rect.width / 2, y: rect.y, iso });
                  }}
                  onMouseLeave={() => {
                    setHoverIso(null);
                    setTooltip(null);
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      {tooltip && data[tooltip.iso] && (
        <div
          className="absolute text-xs px-2 py-1 rounded bg-black text-white pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div>{tooltip.iso}</div>
          <div>Share: {data[tooltip.iso].share}</div>
          <div>5y: {data[tooltip.iso].change}</div>
        </div>
      )}
    </div>
  );
};

export default WorldMap;
