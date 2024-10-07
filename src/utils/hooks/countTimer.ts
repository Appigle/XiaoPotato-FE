import { useEffect, useState } from 'react';
import dayjs from '../dayjs';

const useCountTimer = (date?: Date | string) => {
  const [time, setTime] = useState<string>(dayjs(date || undefined).format());
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(dayjs(date).format('YYYY-MM-DDTHH:mm:ss'));
    }, 1000);
    return () => clearInterval(timer);
  });
  return [time];
};

export default useCountTimer;
