
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MatchResult } from '../pages/Index';

interface ResultsTableProps {
  results: MatchResult[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Results ({results.length} matches)</CardTitle>
        <CardDescription>
          Found matches across all input boxes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Input Box</TableHead>
                <TableHead>Search Term</TableHead>
                <TableHead>Matched Text</TableHead>
                <TableHead>Context</TableHead>
                <TableHead>Position</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    Box {result.inputBoxId}
                  </TableCell>
                  <TableCell>{result.searchText}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {result.matchedText}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {result.context}
                  </TableCell>
                  <TableCell>{result.pageNumber}</TableCell>
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
