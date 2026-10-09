// Fails when the locale files do not have the same keys, so a text added in
// one language cannot be forgotten in the other. Run: yarn check:locales
import en from '../utils/Locales/en.js';
import ru from '../utils/Locales/ru.js';

const flat = (object, prefix = '') =>
  Object.entries(object).flatMap(([key, value]) =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? flat(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );

const ruKeys = new Set(flat(ru));
const enKeys = new Set(flat(en));
const missingInEn = [...ruKeys].filter((key) => !enKeys.has(key));
const missingInRu = [...enKeys].filter((key) => !ruKeys.has(key));

for (const key of missingInEn) console.error(`en.js lacks ${key}`);
for (const key of missingInRu) console.error(`ru.js lacks ${key}`);
if (missingInEn.length + missingInRu.length > 0) {
  process.exit(1);
}
console.log(`Locales match: ${ruKeys.size} keys.`);
