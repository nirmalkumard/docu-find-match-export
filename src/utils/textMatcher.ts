
import { MatchResult } from '../pages/Index';

export const findMatches = (inputTexts: string[], documentText: string): MatchResult[] => {
  const results: MatchResult[] = [];
  
  inputTexts.forEach((searchText, index) => {
    if (searchText.trim() === '') return;
    
    const searchTerms = searchText.trim().split(/\s+/);
    
    searchTerms.forEach(term => {
      if (term.length < 2) return; // Skip very short terms
      
      const matches = findTermMatches(term, documentText, index + 1);
      results.push(...matches);
    });
  });
  
  return results;
};

const findTermMatches = (searchTerm: string, text: string, inputBoxId: number): MatchResult[] => {
  const matches: MatchResult[] = [];
  const lowerText = text.toLowerCase();
  const lowerTerm = searchTerm.toLowerCase();
  
  let startIndex = 0;
  
  while (true) {
    const matchIndex = lowerText.indexOf(lowerTerm, startIndex);
    if (matchIndex === -1) break;
    
    const matchedText = text.substring(matchIndex, matchIndex + searchTerm.length);
    const context = extractContext(text, matchIndex, searchTerm.length);
    const pageNumber = estimatePageNumber(text, matchIndex);
    
    matches.push({
      inputBoxId,
      searchText: searchTerm,
      matchedText,
      context,
      pageNumber
    });
    
    startIndex = matchIndex + 1;
  }
  
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
