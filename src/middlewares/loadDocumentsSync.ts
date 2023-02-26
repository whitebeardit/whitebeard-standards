import { readFileSync } from 'fs';
import * as YAML from 'js-yaml';

export const loadDocumentSync = (file: string): any => {
  return YAML.load(readFileSync(file, 'utf8'));
};
