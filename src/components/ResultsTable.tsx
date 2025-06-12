
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MatchResult } from '../pages/Index';

interface ResultsTableProps {
  results: MatchResult[];
}

interface SearchSummary {
  searchTerm: string;
  occurrences: number;
  pages: number[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  console.log('ResultsTable received results:', results);
  
  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <CardDescription>
            No matches found. Upload a document and enter search terms to begin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Search results will appear here
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group results by search term and calculate summary
  const searchSummaries: SearchSummary[] = [];
  const termGroups = results.reduce((acc, result) => {
    if (!acc[result.searchText]) {
      acc[result.searchText] = [];
    }
    acc[result.searchText].push(result);
    return acc;
  }, {} as Record<string, MatchResult[]>);

  console.log('Term groups:', termGroups);

  Object.entries(termGroups).forEach(([searchTerm, matches]) => {
    const pages = [...new Set(matches.map(match => match.pageNumber))].sort((a, b) => a - b);
    const totalOccurrences = matches.length; // This counts ALL matches, not just unique pages
    
    console.log(`Processing term "${searchTerm}": ${totalOccurrences} occurrences on pages`, pages);
    
    searchSummaries.push({
      searchTerm,
      occurrences: totalOccurrences,
      pages
    });
  });

  console.log('Final search summaries:', searchSummaries);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Results ({results.length} total matches)</CardTitle>
        <CardDescription>
          Found matches for your search terms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Search Term</TableHead>
                <TableHead>Occurrences</TableHead>
                <TableHead>Pages Found</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchSummaries.map((summary, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {summary.searchTerm}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {summary.occurrences}
                  </TableCell>
                  <TableCell>
                    {summary.pages.join(', ')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsTable;
