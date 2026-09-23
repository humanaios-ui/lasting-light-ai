import { useState } from 'react';
import { getPseudonym as generatePseudonym } from '../lib/storage';

export function usePseudonym(): string {
  const [pseudonym] = useState<string>(() => generatePseudonym());

  return pseudonym;
}
