/**
 * Extracts the content under the outermost <template> tag of a Vue component string.
 * @param {string} templateString - The Vue component string containing a <template> section.
 * @returns {string} The content inside the <template> tags, trimmed, or an empty string if invalid.
 */
export function extractVueComponentParts(templateString: string) {
  // Ensure input is a string and not empty
  if (typeof templateString !== 'string' || templateString.trim() === '') {
    console.warn('Invalid input: templateString must be a non-empty string');
    return '';
  }

  // Trim the input to remove leading/trailing whitespace
  const trimmedTemplate = templateString.trim();

  // Regular expression to match the outermost <template> content
  // Captures content between <template> and </template>, accounting for attributes
  const templateRegex = /<template[^>]*>([\s\S]*?)<\/template>/i;

  // Find the match
  const match = trimmedTemplate.match(templateRegex);

  console.log(match)

  if (!match) {
    console.warn('No valid <template> tags found in the input string');
    return '';
  }

  // Extract the content (group 1 from the regex match) and trim it
  let content = match[1].trim();

  // Basic validation: check if content is empty
  if (content === '') {
    console.warn('Template content is empty');
    return '';
  }

  return content;
}