
import mammoth from 'mammoth';

export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.type;
  
  if (fileType === 'application/pdf') {
    return extractTextFromPDF(file);
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileType === 'application/msword'
  ) {
    return extractTextFromWord(file);
  } else {
    throw new Error('Unsupported file type');
  }
};

const extractTextFromPDF = async (file: File): Promise<string> => {
  // For PDF extraction, we'll use a simple approach with FileReader
  // In a production app, you'd want to use PDF.js or similar
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      // Simple text extraction - in reality, you'd use PDF.js
      const text = new TextDecoder().decode(arrayBuffer);
      // Extract readable text (this is a simplified approach)
      const readableText = text.replace(/[^\x20-\x7E\n\r]/g, ' ').replace(/\s+/g, ' ').trim();
      resolve(readableText || 'No readable text found in PDF');
    };
    reader.onerror = () => reject(new Error('Failed to read PDF file'));
    reader.readAsArrayBuffer(file);
  });
};

const extractTextFromWord = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value || 'No text found in document');
      } catch (error) {
        reject(new Error('Failed to extract text from Word document'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read Word file'));
    reader.readAsArrayBuffer(file);
  });
};
