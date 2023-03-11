import config from '../../../../vscode/configs/prettier/config';

describe('Config Prettier', () => {
  it('Should return a right configuration', async () => {
    expect(config).toMatchObject({
      singleQuote: true,
      trailingComma: 'all',
    });
  });
});
