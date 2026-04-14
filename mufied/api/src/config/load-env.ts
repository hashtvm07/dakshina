import * as fs from 'fs';
import * as path from 'path';

function stripWrappingQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function findClosingQuoteIndex(value: string, quoteChar: string) {
  for (let index = 1; index < value.length; index += 1) {
    if (value[index] === quoteChar && value[index - 1] !== '\\') {
      return index;
    }
  }

  return -1;
}

export function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const trimmed = lines[lineIndex].trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let rawValue = trimmed.slice(separatorIndex + 1).trim();
    if (!key || process.env[key] !== undefined) {
      continue;
    }

    if (rawValue.startsWith('"') || rawValue.startsWith("'")) {
      const quoteChar = rawValue[0];
      let combinedValue = rawValue;
      let closingQuoteIndex = findClosingQuoteIndex(combinedValue, quoteChar);

      while (closingQuoteIndex === -1 && lineIndex + 1 < lines.length) {
        lineIndex += 1;
        combinedValue += `\n${lines[lineIndex]}`;
        closingQuoteIndex = findClosingQuoteIndex(combinedValue, quoteChar);
      }

      rawValue = combinedValue;
    }

    process.env[key] = stripWrappingQuotes(rawValue);
  }
}
