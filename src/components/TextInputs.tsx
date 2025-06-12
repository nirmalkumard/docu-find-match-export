
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TextInputsProps {
  inputText: string;
  onInputChange: (value: string) => void;
  onSearch: () => void;
  disabled: boolean;
}

const TextInputs: React.FC<TextInputsProps> = ({ 
  inputText, 
  onInputChange, 
  onSearch, 
  disabled 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Terms</CardTitle>
        <CardDescription>
          Enter keywords, phrases, dates, or numbers to find in the document
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="search-input">
            Search Text
          </Label>
          <Textarea
            id="search-input"
            placeholder="Enter search terms..."
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>
        <Button 
          onClick={onSearch} 
          disabled={disabled}
          className="w-full mt-4"
        >
          Search Document
        </Button>
      </CardContent>
    </Card>
  );
};

export default TextInputs;
