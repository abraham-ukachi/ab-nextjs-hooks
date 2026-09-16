/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-hooks
* ~~~~~~~~~~~~ 
* Copyright (c) 2024 Abraham Ukachi. The abElements Project.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the 'Software'), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions: 
*  
* The above copyright notice and this permission notice shall be included in all 
* copies or substantial portions of the Software. 
*
* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* @project: ab-nextjs-hooks
* @name: Labels - AB Country Hook
* @file: useAbCountryLabels.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use the country labels hook
*    -|> import useCountryLabels from './useAbCountryLabels'
*    -|>
*    -|> const { countryLabels } = useCountryLabels()
*    -|>
*    -|> // console.log(countryLabels) // ==> { "af": "Afghanistan", "al": "Albania", ... }
*    -|>
*
*   2+|> // Get a country label; unknown codes fall back to the uppercased code
*    -|> const { getCountryLabel } = useCountryLabels()
*    -|>
*    -|> // console.log(getCountryLabel('ng')) // ==> "Nigeria"
*    -|> // console.log(getCountryLabel('zz')) // ==> "ZZ"
*    -|>
*/


/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client'


// REACT types
// REACT hooks
import { useMemo } from 'react'
// REACT components


// NEXT.JS types
// NEXT.JS hooks
// NEXT.JS components


// AB types
// AB hooks
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== COUNTRY LABELS - TYPES & CONSTANTS ===== //


// create a set of label types for a country as `CountryLabels`
export type CountryLabels = Record<string, string>


// create a country labels result interface as `CountryLabelsResult`
export interface CountryLabelsResult {
  countryLabels: CountryLabels
  countryKeys: Array<string>
  getCountryLabel: (key: string, labels?: CountryLabels) => string
}



// default country keys: every ISO 3166-1 alpha-2 country code
// note: grouped roughly in reading batches below; codes are used as-is for the labels
export const DEFAULT_COUNTRY_KEYS: Array<string> = [
  // --- af -> ga ---
  'af',
  'al',
  'dz',
  'as',
  'ad',
  'ao',
  'ai',
  'aq',
  'ag',
  'ar',
  'am',
  'aw',
  'au',
  'at',
  'az',
  'bs',
  'bh',
  'bd',
  'bb',
  'by',
  'be',
  'bz',
  'bj',
  'bm',
  'bt',
  'bo',
  'bq',
  'ba',
  'bw',
  'bv',
  'br',
  'io',
  'bn',
  'bg',
  'bf',
  'bi',
  'cv',
  'kh',
  'cm',
  'ca',
  'ky',
  'cf',
  'td',
  'cl',
  'cn',
  'cx',
  'cc',
  'co',
  'km',
  'cd',
  'cg',
  'ck',
  'cr',
  'hr',
  'cu',
  'cw',
  'cy',
  'cz',
  'ci',
  'dk',
  'dj',
  'dm',
  'do',
  'ec',
  'eg',
  'sv',
  'gq',
  'er',
  'ee',
  'sz',
  'et',
  'fk',
  'fo',
  'fj',
  'fi',
  'fr',
  'gf',
  'pf',
  'tf',
  'ga',

  // --- gm -> qa ---
  'gm',
  'ge',
  'de',
  'gh',
  'gi',
  'gr',
  'gl',
  'gd',
  'gp',
  'gu',
  'gt',
  'gg',
  'gn',
  'gw',
  'gy',
  'ht',
  'hm',
  'va',
  'hn',
  'hk',
  'hu',
  'is',
  'in',
  'id',
  'ir',
  'iq',
  'ie',
  'im',
  'il',
  'it',
  'jm',
  'jp',
  'je',
  'jo',
  'kz',
  'ke',
  'ki',
  'kp',
  'kr',
  'kw',
  'kg',
  'la',
  'lv',
  'lb',
  'ls',
  'lr',
  'ly',
  'li',
  'lt',
  'lu',
  'mo',
  'mg',
  'mw',
  'my',
  'mv',
  'ml',
  'mt',
  'mh',
  'mq',
  'mr',
  'mu',
  'yt',
  'mx',
  'fm',
  'md',
  'mc',
  'mn',
  'me',
  'ms',
  'ma',
  'mz',
  'mm',
  'na',
  'nr',
  'np',
  'nl',
  'nc',
  'nz',
  'ni',
  'ne',
  'ng',
  'nu',
  'nf',
  'mk',
  'mp',
  'no',
  'om',
  'pk',
  'pw',
  'ps',

  // --- ro -> ax ---
  'pa',
  'pg',
  'py',
  'pe',
  'ph',
  'pn',
  'pl',
  'pt',
  'pr',
  'qa',
  'ro',
  'ru',
  'rw',
  're',
  'bl',
  'sh',
  'kn',
  'lc',
  'mf',
  'pm',
  'vc',
  'ws',
  'sm',
  'st',
  'sa',
  'sn',
  'rs',
  'sc',
  'sl',
  'sg',
  'sx',
  'sk',
  'si',
  'sb',
  'so',
  'za',
  'gs',
  'ss',
  'es',
  'lk',
  'sd',
  'sr',
  'sj',
  'se',
  'ch',
  'sy',
  'tw',
  'tj',
  'tz',
  'th',
  'tl',
  'tg',
  'tk',
  'to',
  'tt',
  'tn',
  'tr',
  'tm',
  'tc',
  'tv',
  'ug',
  'ua',
  'ae',
  'gb',
  'us',
  'um',
  'uy',
  'uz',
  'vu',
  've',
  'vn',
  'vg',
  'vi',
  'wf',
  'eh',
  'ye',
  'zm',
  'zw',
  'ax'
]


// known country names, keyed by their ISO 3166-1 alpha-2 code
// note: this map powers the fallback logic below (custom label -> known name -> uppercased code)
export const COUNTRY_NAMES: Record<string, string> = {
  af: 'Afghanistan',
  al: 'Albania',
  dz: 'Algeria',
  ad: 'Andorra',
  ao: 'Angola',
  ag: 'Antigua and Barbuda',
  ar: 'Argentina',
  am: 'Armenia',
  au: 'Australia',
  at: 'Austria',
  az: 'Azerbaijan',
  bs: 'Bahamas',
  bh: 'Bahrain',
  bd: 'Bangladesh',
  bb: 'Barbados',
  by: 'Belarus',
  be: 'Belgium',
  bz: 'Belize',
  bj: 'Benin',
  bt: 'Bhutan',
  bo: 'Bolivia',
  ba: 'Bosnia and Herzegovina',
  bw: 'Botswana',
  br: 'Brazil',
  bn: 'Brunei',
  bg: 'Bulgaria',
  bf: 'Burkina Faso',
  bi: 'Burundi',
  cv: 'Cape Verde',
  kh: 'Cambodia',
  cm: 'Cameroon',
  ca: 'Canada',
  cf: 'Central African Republic',
  td: 'Chad',
  cl: 'Chile',
  cn: 'China',
  co: 'Colombia',
  km: 'Comoros',
  cd: 'Congo Democratic Republic',
  cg: 'Congo',
  cr: 'Costa Rica',
  hr: 'Croatia',
  cu: 'Cuba',
  cy: 'Cyprus',
  cz: 'Czechia',
  ci: 'Ivory Coast',
  dk: 'Denmark',
  dj: 'Djibouti',
  dm: 'Dominica',
  do: 'Dominican Republic',
  ec: 'Ecuador',
  eg: 'Egypt',
  sv: 'El Salvador',
  gq: 'Equatorial Guinea',
  er: 'Eritrea',
  ee: 'Estonia',
  sz: 'Eswatini',
  et: 'Ethiopia',
  fj: 'Fiji',
  fi: 'Finland',
  fr: 'France',
  ga: 'Gabon',
  gm: 'Gambia',
  ge: 'Georgia',
  de: 'Germany',
  gh: 'Ghana',
  gr: 'Greece',
  gd: 'Grenada',
  gt: 'Guatemala',
  gn: 'Guinea',
  gw: 'Guinea-Bissau',
  gy: 'Guyana',
  ht: 'Haiti',
  va: 'Vatican City',
  hn: 'Honduras',
  hk: 'Hong Kong',
  hu: 'Hungary',
  is: 'Iceland',
  in: 'India',
  id: 'Indonesia',
  ir: 'Iran',
  iq: 'Iraq',
  ie: 'Ireland',
  il: 'Israel',
  it: 'Italy',
  jm: 'Jamaica',
  jp: 'Japan',
  jo: 'Jordan',
  kz: 'Kazakhstan',
  ke: 'Kenya',
  ki: 'Kiribati',
  kp: 'North Korea',
  kr: 'South Korea',
  kw: 'Kuwait',
  kg: 'Kyrgyzstan',
  la: 'Laos',
  lv: 'Latvia',
  lb: 'Lebanon',
  ls: 'Lesotho',
  lr: 'Liberia',
  ly: 'Libya',
  li: 'Liechtenstein',
  lt: 'Lithuania',
  lu: 'Luxembourg',
  mg: 'Madagascar',
  mw: 'Malawi',
  my: 'Malaysia',
  mv: 'Maldives',
  ml: 'Mali',
  mt: 'Malta',
  mh: 'Marshall Islands',
  mr: 'Mauritania',
  mu: 'Mauritius',
  mx: 'Mexico',
  fm: 'Micronesia',
  md: 'Moldova',
  mc: 'Monaco',
  mn: 'Mongolia',
  me: 'Montenegro',
  ma: 'Morocco',
  mz: 'Mozambique',
  mm: 'Myanmar',
  na: 'Namibia',
  nr: 'Nauru',
  np: 'Nepal',
  nl: 'Netherlands',
  nz: 'New Zealand',
  ni: 'Nicaragua',
  ne: 'Niger',
  ng: 'Nigeria',
  mk: 'North Macedonia',
  no: 'Norway',
  om: 'Oman',
  pk: 'Pakistan',
  pw: 'Palau',
  ps: 'Palestine',
  pa: 'Panama',
  pg: 'Papua New Guinea',
  py: 'Paraguay',
  pe: 'Peru',
  ph: 'Philippines',
  pl: 'Poland',
  pt: 'Portugal',
  pr: 'Puerto Rico',
  qa: 'Qatar',
  ro: 'Romania',
  ru: 'Russia',
  rw: 'Rwanda',
  kn: 'Saint Kitts and Nevis',
  lc: 'Saint Lucia',
  vc: 'Saint Vincent and the Grenadines',
  ws: 'Samoa',
  sm: 'San Marino',
  st: 'Sao Tome and Principe',
  sa: 'Saudi Arabia',
  sn: 'Senegal',
  rs: 'Serbia',
  sc: 'Seychelles',
  sl: 'Sierra Leone',
  sg: 'Singapore',
  sk: 'Slovakia',
  si: 'Slovenia',
  sb: 'Solomon Islands',
  so: 'Somalia',
  za: 'South Africa',
  ss: 'South Sudan',
  es: 'Spain',
  lk: 'Sri Lanka',
  sd: 'Sudan',
  sr: 'Suriname',
  se: 'Sweden',
  ch: 'Switzerland',
  sy: 'Syria',
  tw: 'Taiwan',
  tj: 'Tajikistan',
  tz: 'Tanzania',
  th: 'Thailand',
  tl: 'Timor-Leste',
  tg: 'Togo',
  to: 'Tonga',
  tt: 'Trinidad and Tobago',
  tn: 'Tunisia',
  tr: 'Turkey',
  tm: 'Turkmenistan',
  ug: 'Uganda',
  ua: 'Ukraine',
  ae: 'United Arab Emirates',
  gb: 'United Kingdom',
  us: 'United States',
  uy: 'Uruguay',
  uz: 'Uzbekistan',
  vu: 'Vanuatu',
  ve: 'Venezuela',
  vn: 'Vietnam',
  ye: 'Yemen',
  zm: 'Zambia',
  zw: 'Zimbabwe'
}




// ===== useCountryLabels - AB HOOK ===== //


/**
 * @name useCountryLabels
 * @description A country labels hook that maps ISO alpha-2 codes to country names,
 * with a 3-step fallback: custom label, then the known name, then the uppercased code
 *
 * @param { Array<string> } defaultCountryKeys - The default country keys (ISO alpha-2 codes) to use
 * @param { CountryLabels? } labels - Custom country labels to override the built-in names
 *
 * @returns { CountryLabelsResult }
 */
const useCountryLabels = (
  defaultCountryKeys: Array<string> = DEFAULT_COUNTRY_KEYS,
  labels?: CountryLabels
): CountryLabelsResult => {

  // build the country labels via memoization, only when keys or labels change
  return useMemo(() => {

    // make a mutable copy of the default country keys
    const countryKeys: Array<string> = [...defaultCountryKeys]

    // create the country labels map, starting empty
    const countryLabels: CountryLabels = {}

    // build each label with a 3-step fallback:
    // custom `labels` -> known `COUNTRY_NAMES` -> the code itself, uppercased
    countryKeys.forEach((key: string) => {
      countryLabels[key] = labels?.[key] ?? COUNTRY_NAMES[key] ?? key.toUpperCase()
    })

    // create the country label getter, defaulting to the freshly-built map
    const getCountryLabel = (key: string, currentLabels: CountryLabels = countryLabels): string => currentLabels[key]

    // return `countryLabels`, `countryKeys` & `getCountryLabel`
    return { countryLabels, countryKeys, getCountryLabel }

  }, [defaultCountryKeys, labels])

}


// export `useCountryLabels` hook as named export
export { useCountryLabels }


// export `useCountryLabels` hook as default
export default useCountryLabels
