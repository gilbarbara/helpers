import is from 'is-lite';

/**
 * Capitalize the first letter
 */
export function capitalize(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

/**
 * Cleanup HTML content
 */
export function cleanupHTML(input: string) {
  return removeWhitespace(removeEmptyTags(input));
}

/**
 * Cleanup URI characters
 */
export function cleanupURI(input: string) {
  return input.replace(/[;,/?:@&=+$]/g, '');
}

/**
 * Pluralize strings.
 *
 * If the plural form just adds an `s` to the end, you don't need to pass it.
 */
export function pluralize(quantity: number, singular: string, plural?: string) {
  if (quantity === 1) {
    return singular;
  }

  return plural || `${singular}s`;
}

/**
 * Remove accents
 */
export function removeAccents(input: string) {
  const removalMap = {
    A: /[AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄ]/g,
    AA: /[Ꜳ]/g,
    AE: /[ÆǼǢ]/g,
    AO: /[Ꜵ]/g,
    AU: /[Ꜷ]/g,
    AV: /[ꜸꜺ]/g,
    AY: /[Ꜽ]/g,
    B: /[BⒷＢḂḄḆɃƂƁ]/g,
    C: /[CⒸＣĆĈĊČÇḈƇȻꜾ]/g,
    D: /[DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ]/g,
    DZ: /[ǱǄ]/g,
    Dz: /[ǲǅ]/g,
    E: /[EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ]/g,
    F: /[FⒻＦḞƑꝻ]/g,
    G: /[GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ]/g,
    H: /[HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ]/g,
    I: /[IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ]/g,
    J: /[JⒿＪĴɈ]/g,
    K: /[KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ]/g,
    L: /[LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ]/g,
    LJ: /[Ǉ]/g,
    Lj: /[ǈ]/g,
    M: /[MⓂＭḾṀṂⱮƜ]/g,
    N: /[NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ]/g,
    NJ: /[Ǌ]/g,
    Nj: /[ǋ]/g,
    O: /[OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ]/g,
    OI: /[Ƣ]/g,
    OO: /[Ꝏ]/g,
    OU: /[Ȣ]/g,
    P: /[PⓅＰṔṖƤⱣꝐꝒꝔ]/g,
    Q: /[QⓆＱꝖꝘɊ]/g,
    R: /[RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ]/g,
    S: /[SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ]/g,
    T: /[TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ]/g,
    TZ: /[Ꜩ]/g,
    U: /[UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ]/g,
    V: /[VⓋＶṼṾƲꝞɅ]/g,
    VY: /[Ꝡ]/g,
    W: /[WⓌＷẀẂŴẆẄẈⱲ]/g,
    X: /[XⓍＸẊẌ]/g,
    Y: /[YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ]/g,
    Z: /[ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ]/g,
    a: /[aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ]/g,
    aa: /[ꜳ]/g,
    ae: /[æǽǣ]/g,
    ao: /[ꜵ]/g,
    au: /[ꜷ]/g,
    av: /[ꜹꜻ]/g,
    ay: /[ꜽ]/g,
    b: /[bⓑｂḃḅḇƀƃɓ]/g,
    c: /[cⓒｃćĉċčçḉƈȼꜿↄ]/g,
    d: /[dⓓｄḋďḍḑḓḏđƌɖɗꝺ]/g,
    dz: /[ǳǆ]/g,
    e: /[eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ]/g,
    f: /[fⓕｆḟƒꝼ]/g,
    g: /[gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ]/g,
    h: /[hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ]/g,
    hv: /[ƕ]/g,
    i: /[iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı]/g,
    j: /[jⓙｊĵǰɉ]/g,
    k: /[kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ]/g,
    l: /[lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ]/g,
    lj: /[ǉ]/g,
    m: /[mⓜｍḿṁṃɱɯ]/g,
    n: /[nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ]/g,
    nj: /[ǌ]/g,
    o: /[oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ]/g,
    oi: /[ƣ]/g,
    ou: /[ȣ]/g,
    oo: /[ꝏ]/g,
    p: /[pⓟｐṕṗƥᵽꝑꝓꝕ]/g,
    q: /[qⓠｑɋꝗꝙ]/g,
    r: /[rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ]/g,
    s: /[sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ]/g,
    t: /[tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ]/g,
    tz: /[ꜩ]/g,
    u: /[uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ]/g,
    v: /[vⓥｖṽṿʋꝟʌ]/g,
    vy: /[ꝡ]/g,
    w: /[wⓦｗẁẃŵẇẅẘẉⱳ]/g,
    x: /[xⓧｘẋẍ]/g,
    y: /[yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ]/g,
    z: /[zⓩｚźẑżžẓẕƶȥɀⱬꝣ]/g,
  };
  let parsedString = input;

  Object.entries(removalMap).forEach(([key, value]) => {
    parsedString = parsedString.replace(value, key);
  });

  return parsedString;
}

/**
 * Remove emojis
 */
export function removeEmojis(input: string) {
  return input
    .replace(
      /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g,
      '',
    )
    .trim();
}

/**
 * Remove empty HTML Tags (including whitespace)
 */
export function removeEmptyTags(input: string) {
  return input.replace(/<[^/>][^>]*>\s*<\/[^>]+>/gi, '');
}

/**
 * Remove non-printable ASCII characters
 */
export function removeNonPrintableCharacters(input: string) {
  return is.string(input) ? input.replace(/[^\u00C0-\u00FF\x20-\x7E´˜ˆ]+/g, '') : input;
}

/**
 * Remove HTML tags
 */
export function removeTags(input: string) {
  return input.replace(/(<([^>]+)>)/gi, '');
}

/**
 * Remove whitespace
 */
export function removeWhitespace(input: string) {
  return input.replace(/\r\n|\r|\n|\t/g, '').replace(/[ ]+/g, ' ');
}

/**
 * Format string to slug
 */
export function slugify(input: string) {
  return removeAccents(input)
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[()]/g, '')
    .replace(/ /g, '-')
    .replace(/[|^{}%"<>\\`]/g, '')
    .toLowerCase();
}
