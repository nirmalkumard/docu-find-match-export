
import { MatchResult } from '../pages/Index';

export const findMatches = (inputTexts: string[], documentText: string): MatchResult[] => {
  console.log('=== findMatches START ===');
  console.log('inputTexts:', inputTexts);
  console.log('documentText length:', documentText.length);
  console.log('documentText preview:', documentText.substring(0, 200));
  
  if (!documentText || documentText.trim() === '') {
    console.log('No document text available');
    return [];
  }
  
  const results: MatchResult[] = [];
  
  inputTexts.forEach((searchText, index) => {
    console.log(`\n--- Processing input ${index + 1} ---`);
    console.log(`Input value: "${searchText}"`);
    
    if (!searchText || searchText.trim() === '') {
      console.log(`Input ${index + 1} is empty, skipping`);
      return;
    }
    
    const trimmedSearchText = searchText.trim();
    console.log(`Trimmed search text: "${trimmedSearchText}"`);
    
    // Split by whitespace and filter out empty strings
    const searchTerms = trimmedSearchText.split(/\s+/).filter(term => term.length > 0);
    console.log(`Search terms after split:`, searchTerms);
    
    searchTerms.forEach(term => {
      if (term.length < 1) {
        console.log(`Term "${term}" too short, skipping`);
        return;
      }
      
      console.log(`Searching for term: "${term}"`);
      const matches = findTermMatches(term, documentText, index + 1);
      console.log(`Found ${matches.length} matches for term "${term}"`);
      results.push(...matches);
    });
  });
  
  console.log(`\n=== findMatches END - Total matches: ${results.length} ===`);
  return results;
};

const findTermMatches = (searchTerm: string, text: string, inputBoxId: number): MatchResult[] => {
  console.log(`\n>> findTermMatches for "${searchTerm}"`);
  
  const matches: MatchResult[] = [];
  const lowerText = text.toLowerCase();
  const lowerTerm = searchTerm.toLowerCase();
  
  console.log(`Searching for "${lowerTerm}" in text`);
  
  let startIndex = 0;
  let matchCount = 0;
  
  while (startIndex < text.length) {
    const matchIndex = lowerText.indexOf(lowerTerm, startIndex);
    
    if (matchIndex === -1) {
      console.log(`No more matches found after index ${startIndex}`);
      break;
    }
    
    matchCount++;
    console.log(`Match ${matchCount} found at index ${matchIndex}`);
    
    const matchedText = text.substring(matchIndex, matchIndex + searchTerm.length);
    const context = extractContext(text, matchIndex, searchTerm.length);
    const pageNumber = estimatePageNumber(text, matchIndex);
    
    console.log(`Match details:`, {
      matchedText,
      context: context.substring(0, 50) + '...',
      pageNumber
    });
    
    matches.push({
      inputBoxId,
      searchText: searchTerm,
      matchedText,
      context,
      pageNumber
    });
    
    startIndex = matchIndex + 1;
  }
  
  console.log(`<< findTermMatches complete: ${matches.length} matches found`);
  return matches;
};

const extractContext = (text: string, matchIndex: number, matchLength: number): string => {
  const contextRadius = 50;
  const start = Math.max(0, matchIndex - contextRadius);
  const end = Math.min(text.length, matchIndex + matchLength + contextRadius);
  
  let context = text.substring(start, end);
  
  // Add ellipsis if truncated
  if (start > 0) context = '...' + context;
  if (end < text.length) context = context + '...';
  
  return context.replace(/\s+/g, ' ').trim();
};

const estimatePageNumber = (text: string, matchIndex: number): number => {
  // Rough estimation: assume ~500 characters per page
  const charactersPerPage = 500;
  return Math.floor(matchIndex / charactersPerPage) + 1;
};
