import useCountTimer from '@src/utils/hooks/countTimer';

export default function CountTimer() {
  const [timeShowStr] = useCountTimer();
  return <div className="flex w-screen items-center justify-center font-light">{timeShowStr}</div>;
}
