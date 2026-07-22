import { useState, useEffect } from 'react';

export function useDubaiClock() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    function update() {
      const now = new Date();
      const dubaiTime = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Dubai',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setTime(dubaiTime);
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}
