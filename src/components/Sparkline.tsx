import { ResponsiveContainer, LineChart, Line } from 'recharts';
interface SparklineProps {
  animate: boolean;
}

const data = [
  { value: 1 },
  { value: 1.2 },
  { value: 1.4 },
  { value: 1.6 },
  { value: 1.8 },
  { value: 2 }
];

const Sparkline = ({ animate }: SparklineProps) => (
  <div className="h-8">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke="#C9A970"
          strokeWidth={2}
          dot={false}
          isAnimationActive={animate}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default Sparkline;
