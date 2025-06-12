
import { MatchResult } from '../pages/Index';

export const exportToCSV = (results: MatchResult[], fileName: string) => {
  const headers = ['InputBoxID', 'SearchText', 'MatchedText', 'Context', 'PageNumber'];
  
  const csvContent = [
    headers.join(','),
    ...results.map(result => [
      result.inputBoxId,
      `"${escapeCSV(result.searchText)}"`,
      `"${escapeCSV(result.matchedText)}"`,
      `"${escapeCSV(result.context)}"`,
      result.pageNumber
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}_matches.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const escapeCSV = (text: string): string => {
  return text.replace(/"/g, '""');
};
