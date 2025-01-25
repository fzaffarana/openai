function findPartialJson(input: string): Record<string, unknown> {
  const DELIMITER = '```';
  const delimiterStart = input.indexOf(DELIMITER);
  let jsonString = '';

  if (delimiterStart !== -1) {
    const start = delimiterStart + DELIMITER.length;
    const end = input.indexOf(DELIMITER, start);
    if (end !== -1) {
      jsonString = `{${input.substring(start, end).trim()}}`;
    }
  }

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    return {};
  }
}

export function findFirstValidJson(input: string): Record<string, unknown> {
  const leftBraceIndex = input.indexOf('{');
  const rightBraceIndex = input.lastIndexOf('}');

  if (leftBraceIndex === -1 || rightBraceIndex === -1 || leftBraceIndex >= rightBraceIndex) {
    return findPartialJson(input);
  }

  for (let start = leftBraceIndex; start <= rightBraceIndex; start++) {
    for (let end = rightBraceIndex; end >= start; end--) {
      try {
        const substring = input.substring(start, end + 1);
        const parsed = JSON.parse(substring);
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed;
        }
      } catch {
        // ignore parse error and try next substring
      }
    }
  }

  return {};
}
