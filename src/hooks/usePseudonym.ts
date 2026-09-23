import { useState, useEffect } from 'react';
import { getPseudonym } from '../lib/storage';

export function usePseudonym(): string | null {
  const [pseudonym, setPseudonym] = useState<string | null>(null);

  useEffect(() => {
    setPseudonym(getPseudonym());
  }, []);

  return pseudonym;
}
