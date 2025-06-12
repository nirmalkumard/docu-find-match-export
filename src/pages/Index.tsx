
import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import TextInputs from '../components/TextInputs';
import ResultsTable from '../components/ResultsTable';
import { extractTextFromFile } from '../utils/documentExtractor';
import { findMatches } from '../utils/textMatcher';
import { exportToCSV } from '../utils/csvExporter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface MatchResult {
  inputBoxId: number;
  searchText: string;
  matchedText: string;
  context: string;
  pageNumber: number;
  position: number; // Add position field for better duplicate detection
}

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [results, setResults] = useState<MatchResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  console.log('=== Index Component State ===', { 
    uploadedFile: uploadedFile?.name, 
    extractedTextLength: extractedText.length,
    inputText,
    resultsCount: results.length 
  });

  const handleFileUpload = async (file: File) => {
    console.log('=== FILE UPLOAD START ===');
    console.log('File details:', { name: file.name, type: file.type, size: file.size });
    setIsProcessing(true);
    try {
      const text = await extractTextFromFile(file);
      console.log('Text extraction successful. Length:', text.length);
      console.log('Extracted text preview:', text.substring(0, 300));
      setUploadedFile(file);
      setExtractedText(text);
      setResults([]); // Clear previous results
      toast({
        title: "File uploaded successfully",
        description: `Extracted ${text.length} characters from ${file.name}`,
      });
    } catch (error) {
      console.error('=== FILE EXTRACTION ERROR ===', error);
      toast({
        title: "Error processing file",
        description: error.message || "Please try uploading a different file.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      console.log('=== FILE UPLOAD END ===');
    }
  };

  const handleInputChange = (value: string) => {
    console.log(`Input changed to: "${value}"`);
    setInputText(value);
  };

  const handleSearch = () => {
    console.log('=== SEARCH BUTTON CLICKED ===');
    console.log('Current state check:', {
      hasExtractedText: !!extractedText,
      extractedTextLength: extractedText.length,
      inputText: inputText
    });
    
    if (!extractedText) {
      console.log('No extracted text available');
      toast({
        title: "No document uploaded",
        description: "Please upload a document first.",
        variant: "destructive",
      });
      return;
    }

    if (inputText.trim() === '') {
      console.log('No search text provided');
      toast({
        title: "No search terms",
        description: "Please enter search terms.",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting search with:', { inputText, extractedTextLength: extractedText.length });
    const allMatches = findMatches(inputText, extractedText);
    console.log('Search completed. Results:', allMatches);
    
    setResults(allMatches);
    
    toast({
      title: "Search completed",
      description: `Found ${allMatches.length} matches.`,
    });
    console.log('=== SEARCH COMPLETE ===');
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

            {/* File Status Card */}
            {uploadedFile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={20} />
                    File Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-muted-foreground" />
                      <span className="font-medium">{uploadedFile.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Size: {(uploadedFile.size / 1024).toFixed(1)} KB
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Text extracted: {extractedText.length} characters
                    </div>
                    {extractedText && (
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium mb-2">Text Preview:</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {extractedText.substring(0, 200)}
                          {extractedText.length > 200 && '...'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <TextInputs 
              inputText={inputText}
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
