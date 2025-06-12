
import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import TextInputs from '../components/TextInputs';
import ResultsTable from '../components/ResultsTable';
import { extractTextFromFile } from '../utils/documentExtractor';
import { findMatches } from '../utils/textMatcher';
import { exportToCSV } from '../utils/csvExporter';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface MatchResult {
  inputBoxId: number;
  searchText: string;
  matchedText: string;
  context: string;
  pageNumber: number;
}

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [inputTexts, setInputTexts] = useState<string[]>(['', '', '']);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await extractTextFromFile(file);
      setUploadedFile(file);
      setExtractedText(text);
      toast({
        title: "File uploaded successfully",
        description: `Extracted ${text.length} characters from ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "Please try uploading a different file.",
        variant: "destructive",
      });
      console.error('File extraction error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputTexts];
    newInputs[index] = value;
    setInputTexts(newInputs);
  };

  const handleSearch = () => {
    if (!extractedText) {
      toast({
        title: "No document uploaded",
        description: "Please upload a document first.",
        variant: "destructive",
      });
      return;
    }

    const searchTerms = inputTexts.filter(text => text.trim() !== '');
    if (searchTerms.length === 0) {
      toast({
        title: "No search terms",
        description: "Please enter at least one search term.",
        variant: "destructive",
      });
      return;
    }

    const allMatches = findMatches(inputTexts, extractedText);
    setResults(allMatches);
    
    toast({
      title: "Search completed",
      description: `Found ${allMatches.length} matches across all inputs.`,
    });
  };

  const handleDownloadCSV = () => {
    if (results.length === 0) {
      toast({
        title: "No results to export",
        description: "Please perform a search first.",
        variant: "destructive",
      });
      return;
    }

    exportToCSV(results, uploadedFile?.name || 'document');
    toast({
      title: "CSV downloaded",
      description: "Results have been exported successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Document Text Matcher
          </h1>
          <p className="text-muted-foreground">
            Upload a document, enter search terms, and find matches with CSV export
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FileUploader 
              onFileUpload={handleFileUpload} 
              isProcessing={isProcessing}
            />
            
            <TextInputs 
              inputTexts={inputTexts}
              onInputChange={handleInputChange}
              onSearch={handleSearch}
              disabled={!extractedText}
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Results</h2>
              <Button 
                onClick={handleDownloadCSV}
                disabled={results.length === 0}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Download CSV
              </Button>
            </div>
            
            <ResultsTable results={results} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
