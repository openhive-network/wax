export const extractBracedStrings = (s: string): string[] => {
  const result: string[] = [];
  const length = s.length;
  let i = 0;

  while (i < length) {
    // Find the opening brace
    const start = s.indexOf('{', i);
    if (start === -1) break;  // No more opening braces found

    // Find the closing brace
    const end = s.indexOf('}', start + 1);
    if (end === -1) break;  // No closing brace found

    // Extract the substring between the braces
    const substring = s.slice(start + 1, end);
    result.push(substring);

    // Move the index past the closing brace
    i = end + 1;
  }

  return result;
};
