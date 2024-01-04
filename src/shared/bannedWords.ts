export const bannedWords = ['nigger', 'niggers'];

export function containsBannedWords(inputText: string) {
  return bannedWords.some(word => inputText.toLowerCase().includes(word));
}
