import * as fs from 'fs';
import * as YAML from 'js-yaml';
import { loadDocumentSync } from '../../middlewares/loadDocumentsSync';

jest.mock('fs');
const readFileSpy = jest
  .spyOn(fs, 'readFileSync')
  .mockReturnValue('STRING_FILE_CONTENT');
jest.mock('js-yaml');
const YAMLSpy = jest.spyOn(YAML, 'load');

describe('loadDocumentsSync', () => {
  it('should read a file and load a yaml when call loadDocumentSync', async () => {
    loadDocumentSync('file');

    expect(readFileSpy).toHaveBeenCalledTimes(1);
    expect(readFileSpy).toHaveBeenCalledWith('file', 'utf8');
    expect(YAMLSpy).toHaveBeenCalledTimes(1);
    expect(YAMLSpy).toHaveBeenCalledWith('STRING_FILE_CONTENT');
  });
});
