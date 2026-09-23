/* FDS: F3-Component | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */

import { useState } from 'react';
import { getPseudonym as generatePseudonym } from '../lib/storage';

export function usePseudonym(): string {
  const [pseudonym] = useState<string>(() => generatePseudonym());

  return pseudonym;
}
