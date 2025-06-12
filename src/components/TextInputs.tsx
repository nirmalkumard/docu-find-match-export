
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TextInputsProps {
  inputTexts: string[];
  onInputChange: (index: number, value: string) => void;
  onSearch: () => void;
  disabled: boolean;
}

const TextInputs: React.FC<TextInputsProps> = ({ 
  inputTexts, 
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
        {inputTexts.map((text, index) => (
          <div key={index}>
            <Label htmlFor={`input-${index + 1}`}>
              Input Box {index + 1}
            </Label>
            <Textarea
              id={`input-${index + 1}`}
              placeholder={`Enter search terms for input ${index + 1}...`}
              value={text}
              onChange={(e) => onInputChange(index, e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
        ))}
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
