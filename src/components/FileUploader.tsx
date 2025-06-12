
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ];
      
      if (validTypes.includes(file.type)) {
        onFileUpload(file);
      } else {
        alert('Please upload a PDF or Word document (.pdf, .docx, .doc)');
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
        <CardDescription>
          Upload a PDF or Word document to extract and search text content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <Upload className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground mb-4">
            Drag & drop or click to upload
          </p>
          <Button 
            onClick={handleUploadClick}
            disabled={isProcessing}
            className="mb-2"
          >
            {isProcessing ? 'Processing...' : 'Choose File'}
          </Button>
          <p className="text-sm text-muted-foreground">
            Supports PDF, DOC, and DOCX files
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
