import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
interface WorldMapProps {
  highlight?: string;
}

const geoUrl = 'https://unpkg.com/world-atlas@1/world/110m.json';

const WorldMap = ({ highlight }: WorldMapProps) => (
  <ComposableMap projectionConfig={{ scale: 90 }} className="w-full h-32">
    <Geographies geography={geoUrl}>
      {({ geographies }) =>
        geographies.map(geo => {
          const isActive = highlight && geo.properties.ISO_A3 === highlight;
          return (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={isActive ? '#C9A970' : '#DDD'}
              stroke="#888"
            />
          );
        })
      }
    </Geographies>
  </ComposableMap>
);

export default WorldMap;
