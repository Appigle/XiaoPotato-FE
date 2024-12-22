import { useState } from 'react';

const useGod = () => {
  const [god] = useState(
    () => URLSearchParams && new URLSearchParams(window.location.search).get('god'),
  );
  const [isGod] = useState(god?.toLocaleLowerCase() === 'ray');
  return [god, isGod];
};

export default useGod;
