
import { MatchResult } from '../pages/Index';

export const findMatches = (searchText: string, documentText: string): MatchResult[] => {
  console.log('=== findMatches START ===');
  console.log('searchText:', searchText);
  console.log('documentText length:', documentText.length);
  console.log('documentText preview:', documentText.substring(0, 200));
  
  if (!documentText || documentText.trim() === '') {
    console.log('No document text available');
    return [];
  }
  
  if (!searchText || searchText.trim() === '') {
    console.log('No search text provided');
    return [];
  }
  
  const trimmedSearchText = searchText.trim();
  console.log(`Searching for: "${trimmedSearchText}"`);
  
  // Split by whitespace and filter out empty strings
  const searchTerms = trimmedSearchText.split(/\s+/).filter(term => term.length > 0);
  console.log(`Search terms after split:`, searchTerms);
  
  // Also search for the full phrase as one term if it contains multiple words
  if (searchTerms.length > 1) {
    searchTerms.push(trimmedSearchText);
  }
  
  const results: MatchResult[] = [];
  
  searchTerms.forEach(term => {
    if (term.length < 1) {
      console.log(`Term "${term}" too short, skipping`);
      return;
    }
    
    console.log(`Searching for term: "${term}"`);
    const matches = findTermMatches(term, documentText);
    console.log(`Found ${matches.length} matches for term "${term}"`);
    results.push(...matches);
  });
  
  // Remove duplicates based on searchText and context
  const uniqueResults = results.filter((result, index, array) => {
    return array.findIndex(r => 
      r.searchText === result.searchText && 
      r.context === result.context &&
      r.pageNumber === result.pageNumber
    ) === index;
  });
  
  console.log(`\n=== findMatches END - Total unique matches: ${uniqueResults.length} ===`);
  return uniqueResults;
};

const findTermMatches = (searchTerm: string, text: string): MatchResult[] => {
  console.log(`\n>> findTermMatches for "${searchTerm}"`);
  
  const matches: MatchResult[] = [];
  const lowerText = text.toLowerCase();
  const lowerTerm = searchTerm.toLowerCase();
  
  console.log(`Searching for "${lowerTerm}" in text (case insensitive)`);
  
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
      pageNumber,
      position: matchIndex
    });
    
    matches.push({
      inputBoxId: 1, // Single input box
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
  const contextRadius = 100;
  const start = Math.max(0, matchIndex - contextRadius);
  const end = Math.min(text.length, matchIndex + matchLength + contextRadius);
  
  let context = text.substring(start, end);
  
  // Add ellipsis if truncated
  if (start > 0) context = '...' + context;
  if (end < text.length) context = context + '...';
  
  // Highlight the matched text in the context
  const relativeMatchStart = matchIndex - start + (start > 0 ? 3 : 0);
  const beforeMatch = context.substring(0, relativeMatchStart);
  const matchText = context.substring(relativeMatchStart, relativeMatchStart + matchLength);
  const afterMatch = context.substring(relativeMatchStart + matchLength);
  
  return `${beforeMatch}**${matchText}**${afterMatch}`.replace(/\s+/g, ' ').trim();
};

const estimatePageNumber = (text: string, matchIndex: number): number => {
  // Look for page markers first
  const textBeforeMatch = text.substring(0, matchIndex);
  const pageMarkers = textBeforeMatch.match(/--- Page (\d+) ---/g);
  
  if (pageMarkers && pageMarkers.length > 0) {
    const lastPageMarker = pageMarkers[pageMarkers.length - 1];
    const pageMatch = lastPageMarker.match(/--- Page (\d+) ---/);
    if (pageMatch) {
      return parseInt(pageMatch[1], 10);
    }
  }
  
  // Fallback to character-based estimation
  const charactersPerPage = 2000;
  return Math.floor(matchIndex / charactersPerPage) + 1;
};
