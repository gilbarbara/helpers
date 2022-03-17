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
  return input.replace(/[$&+,/:;=?@]/g, '');
}

/**
 * Get initials from name
 */
export function getInitials(input: string) {
  if (!input) {
    return '';
  }

  const names = input.trim().split(' ');

  if (names.length === 1) {
    return `${names[0].charAt(0)}`;
  }

  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`;
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
    A: /[AÀÁÂÃÄÅĀĂĄǍǞǠǺȀȂȦḀẠẢẤẦẨẪẬẮẰẲẴẶⒶＡ]/g,
    AA: /Ꜳ/g,
    AE: /[ÆǢǼ]/g,
    AO: /Ꜵ/g,
    AU: /Ꜷ/g,
    AV: /[ꜸꜺ]/g,
    AY: /Ꜽ/g,
    B: /[BƁƂɃḂḄḆⒷＢ]/g,
    C: /[CÇĆĈĊČƇȻḈⒸꜾＣ]/g,
    D: /[DĎĐƉƊƋḊḌḎḐḒⒹꝹＤ]/g,
    DZ: /[ǄǱ]/g,
    Dz: /[ǅǲ]/g,
    E: /[EÈÉÊËĒĔĖĘĚƎƐȄȆȨḔḖḘḚḜẸẺẼẾỀỂỄỆⒺＥ]/g,
    F: /[FƑḞⒻꝻＦ]/g,
    G: /[GĜĞĠĢƓǤǦǴḠⒼꝽꝾꞠＧ]/g,
    H: /[HĤĦȞḢḤḦḨḪⒽⱧⱵꞍＨ]/g,
    I: /[IÌÍÎÏĨĪĬĮİƗǏȈȊḬḮỈỊⒾＩ]/g,
    J: /[JĴɈⒿＪ]/g,
    K: /[KĶƘǨḰḲḴⓀⱩꝀꝂꝄꞢＫ]/g,
    L: /[LĹĻĽĿŁȽḶḸḺḼⓁⱠⱢꝆꝈꞀＬ]/g,
    LJ: /Ǉ/g,
    Lj: /ǈ/g,
    M: /[MƜḾṀṂⓂⱮＭ]/g,
    N: /[NÑŃŅŇƝǸȠṄṆṈṊⓃꞐꞤＮ]/g,
    NJ: /Ǌ/g,
    Nj: /ǋ/g,
    O: /[OÒÓÔÕÖØŌŎŐƆƟƠǑǪǬǾȌȎȪȬȮȰṌṎṐṒỌỎỐỒỔỖỘỚỜỞỠỢⓄꝊꝌＯ]/g,
    OI: /Ƣ/g,
    OO: /Ꝏ/g,
    OU: /Ȣ/g,
    P: /[PƤṔṖⓅⱣꝐꝒꝔＰ]/g,
    Q: /[QɊⓆꝖꝘＱ]/g,
    R: /[RŔŖŘȐȒɌṘṚṜṞⓇⱤꝚꞂꞦＲ]/g,
    S: /[SŚŜŞŠȘṠṢṤṦṨẞⓈⱾꞄꞨＳ]/g,
    T: /[TŢŤŦƬƮȚȾṪṬṮṰⓉꞆＴ]/g,
    TZ: /Ꜩ/g,
    U: /[UÙÚÛÜŨŪŬŮŰŲƯǓǕǗǙǛȔȖɄṲṴṶṸṺỤỦỨỪỬỮỰⓊＵ]/g,
    V: /[VƲɅṼṾⓋꝞＶ]/g,
    VY: /Ꝡ/g,
    W: /[WŴẀẂẄẆẈⓌⱲＷ]/g,
    X: /[XẊẌⓍＸ]/g,
    Y: /[YÝŶŸƳȲɎẎỲỴỶỸỾⓎＹ]/g,
    Z: /[ZŹŻŽƵȤẐẒẔⓏⱫⱿꝢＺ]/g,
    a: /[aàáâãäåāăąǎǟǡǻȁȃȧɐḁẚạảấầẩẫậắằẳẵặⓐⱥａ]/g,
    aa: /ꜳ/g,
    ae: /[æǣǽ]/g,
    ao: /ꜵ/g,
    au: /ꜷ/g,
    av: /[ꜹꜻ]/g,
    ay: /ꜽ/g,
    b: /[bƀƃɓḃḅḇⓑｂ]/g,
    c: /[cçćĉċčƈȼḉↄⓒꜿｃ]/g,
    d: /[dďđƌɖɗḋḍḏḑḓⓓꝺｄ]/g,
    dz: /[ǆǳ]/g,
    e: /[eèéêëēĕėęěǝȅȇȩɇɛḕḗḙḛḝẹẻẽếềểễệⓔｅ]/g,
    f: /[fƒḟⓕꝼｆ]/g,
    g: /[gĝğġģǥǧǵɠᵹḡⓖꝿꞡｇ]/g,
    h: /[hĥħȟɥḣḥḧḩḫẖⓗⱨⱶｈ]/g,
    hv: /ƕ/g,
    i: /[iìíîïĩīĭįıǐȉȋɨḭḯỉịⓘｉ]/g,
    j: /[jĵǰɉⓙｊ]/g,
    k: /[kķƙǩḱḳḵⓚⱪꝁꝃꝅꞣｋ]/g,
    l: /[lĺļľŀłſƚɫḷḹḻḽⓛⱡꝇꝉꞁｌ]/g,
    lj: /ǉ/g,
    m: /[mɯɱḿṁṃⓜｍ]/g,
    n: /[nñńņňŉƞǹɲṅṇṉṋⓝꞑꞥｎ]/g,
    nj: /ǌ/g,
    o: /[oòóôõöøōŏőơǒǫǭǿȍȏȫȭȯȱɔɵṍṏṑṓọỏốồổỗộớờởỡợⓞꝋꝍｏ]/g,
    oi: /ƣ/g,
    ou: /ȣ/g,
    oo: /ꝏ/g,
    p: /[pƥᵽṕṗⓟꝑꝓꝕｐ]/g,
    q: /[qɋⓠꝗꝙｑ]/g,
    r: /[rŕŗřȑȓɍɽṙṛṝṟⓡꝛꞃꞧｒ]/g,
    s: /[sßśŝşšșȿṡṣṥṧṩẛⓢꞅꞩｓ]/g,
    t: /[tţťŧƭțʈṫṭṯṱẗⓣⱦꞇｔ]/g,
    tz: /ꜩ/g,
    u: /[uùúûüũūŭůűųưǔǖǘǚǜȕȗʉṳṵṷṹṻụủứừửữựⓤｕ]/g,
    v: /[vʋʌṽṿⓥꝟｖ]/g,
    vy: /ꝡ/g,
    w: /[wŵẁẃẅẇẉẘⓦⱳｗ]/g,
    x: /[xẋẍⓧｘ]/g,
    y: /[yýÿŷƴȳɏẏẙỳỵỷỹỿⓨｙ]/g,
    z: /[zźżžƶȥɀẑẓẕⓩⱬꝣｚ]/g,
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
      /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\u20d0-\u20f0\ufe20-\ufe23]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\u20d0-\u20f0\ufe20-\ufe23]|\ud83c[\udffb-\udfff])?)*/g,
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
  return input.replace(/[^\x20-\x7E´\u00C0-\u00FFˆ˜]+/g, '');
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
  return input.replace(/\r\n|\r|\n|\t/g, '').replace(/ +/g, ' ');
}

/**
 * Format string to slug
 */
export function slugify(input: string) {
  return removeAccents(input)
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[()]/g, '')
    .replace(/ /g, '-')
    .replace(/["%<>\\^`{|}]/g, '')
    .toLowerCase();
}
