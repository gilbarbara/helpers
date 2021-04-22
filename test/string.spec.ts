import {
  capitalize,
  cleanupHTML,
  cleanupURI,
  removeAccents,
  removeEmojis,
  removeEmptyTags,
  removeNonPrintableCharacters,
  removeTags,
  removeWhitespace,
  slugify,
} from '../src';

describe('capitalize', () => {
  it('should return a string capitalized', () => {
    expect(capitalize('acessórios')).toBe('Acessórios');
    expect(capitalize('óculos')).toBe('Óculos');
    expect(capitalize('lorem ipsum')).toBe('Lorem ipsum');
  });
});

describe('cleanupHTML', () => {
  it('should return a clean string', () => {
    expect(cleanupHTML('O <b>melhor</b> preço <i></i> que você    já viu.')).toBe(
      'O <b>melhor</b> preço que você já viu.',
    );
  });
});

describe('cleanupURI', () => {
  it('should return a clean string', () => {
    expect(cleanupURI('a;b,c/d?e:f@g&h=i+j$k')).toBe('abcdefghijk');
  });
});

describe('removeAccents', () => {
  it('should return a string without accents', () => {
    expect(removeAccents('acessórios')).toBe('acessorios');
    expect(removeAccents('sandálias')).toBe('sandalias');
    expect(removeAccents('chapéus')).toBe('chapeus');
  });
});

describe('removeEmptyTags', () => {
  it('should remove empty tags from an html string', () => {
    expect(removeEmptyTags('<p>My html is nuts<span></span>, and its awesome.</p>')).toBe(
      '<p>My html is nuts, and its awesome.</p>',
    );
    expect(removeEmptyTags('<span></span><p>This is an awesome html.</p>')).toBe(
      '<p>This is an awesome html.</p>',
    );
    expect(removeEmptyTags('<p>This is an awesome html.</p><span>    </span>')).toBe(
      '<p>This is an awesome html.</p>',
    );
  });
});

describe('removeEmojis', () => {
  it('should remove emojis from a string', () => {
    expect(removeEmojis('🏎️ Fast and Furious')).toBe('Fast and Furious');
    expect(removeEmojis('Vestidos 👗')).toBe('Vestidos');
  });
});

describe('removeNonPrintableCharacters', () => {
  it('should remove non ASCII characters from a string', () => {
    expect(removeNonPrintableCharacters('Fast and Furious 🏎️')).toBe('Fast and Furious ');
    expect(removeNonPrintableCharacters('▓¿©╬ characters')).toBe(' characters');
  });
});

describe('removeTags', () => {
  it('should remove all tags from an html string', () => {
    expect(removeTags('<p>My html is nuts<span></span>, and its awesome.</p>')).toBe(
      'My html is nuts, and its awesome.',
    );
    expect(removeTags('<span></span><p>This is an awesome html.</p>')).toBe(
      'This is an awesome html.',
    );
    expect(removeTags('<p>This is an awesome html.</p><span></span>')).toBe(
      'This is an awesome html.',
    );
  });
});

describe('removeWhitespace', () => {
  it('should remove extra whitespace from string', () => {
    expect(removeWhitespace('I saw      Susie sitting    in a shoe  shine   shop.')).toBe(
      'I saw Susie sitting in a shoe shine shop.',
    );
  });
});

describe('slugify', () => {
  it('should transform a string into a slug', () => {
    expect(slugify('calçados épicos')).toBe('calcados-epicos');
    expect(slugify('Ipanema (Aníbal de Mendonça')).toBe('ipanema-anibal-de-mendonca');
    expect(slugify('SIMPL%%E ORG<<ANI>>C GRE%EN W"A|TE\\R" DE ^PIT|AN``GA - 100% NATU{R}AL')).toBe(
      'simple-organic-green-water-de-pitanga---100-natural',
    );
  });
});
