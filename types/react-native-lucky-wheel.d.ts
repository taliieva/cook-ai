declare module 'react-native-lucky-wheel' {
  interface WheelOption {
    name: string;
    color: string;
  }
  
  interface LuckyWheelProps {
    options: WheelOption[];
    width?: number;
    height?: number;
    borderColor?: string;
    borderWidth?: number;
    innerRadius?: number;
    duration?: number;
    getWinner?: (value: string) => void;
    backgroundColor?: string;
    textColor?: string;
    knobColor?: string;
    knobSize?: number;
    onPress?: () => void;
  }
  
  const LuckyWheel: React.FC<LuckyWheelProps>;
  export default LuckyWheel;
}