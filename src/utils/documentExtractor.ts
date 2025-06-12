import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const extractTextFromFile = async (file: File): Promise<string> => {
  console.log('=== EXTRACTING TEXT FROM FILE ===');
  console.log('File details:', { name: file.name, type: file.type, size: file.size });
  
  const fileType = file.type;
  
  if (fileType === 'application/pdf') {
    return extractTextFromPDF(file);
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileType === 'application/msword'
  ) {
    return extractTextFromWord(file);
  } else if (fileType === 'text/plain' || file.name.endsWith('.txt')) {
    return extractTextFromPlainText(file);
  } else {
    throw new Error('Unsupported file type. Please upload a PDF, Word document, or text file.');
  }
};

const extractTextFromPlainText = async (file: File): Promise<string> => {
  console.log('Extracting text from plain text file...');
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        console.log(`Plain text file length: ${text.length}`);
        console.log('Plain text preview:', text.substring(0, 300));
        
        if (text.trim().length === 0) {
          throw new Error('No readable text found in file');
        }
        
        resolve(text);
      } catch (error) {
        console.error('Plain text extraction error:', error);
        reject(new Error(`Failed to extract text from file: ${error.message}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
};

const extractTextFromPDF = async (file: File): Promise<string> => {
  console.log('Extracting text from PDF using PDF.js...');
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    console.log(`PDF loaded. Number of pages: ${pdf.numPages}`);
    
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log(`Processing page ${pageNum}...`);
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
      console.log(`Page ${pageNum} text length: ${pageText.length}`);
    }
    
    console.log(`Total extracted text length: ${fullText.length}`);
    console.log('PDF text extraction preview:', fullText.substring(0, 300));
    
    if (fullText.trim().length === 0) {
      throw new Error('No readable text found in PDF');
    }
    
    return fullText;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

const extractTextFromWord = async (file: File): Promise<string> => {
  console.log('Extracting text from Word document using mammoth.js...');
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const result = await mammoth.extractRawText({ arrayBuffer });
        
        console.log(`Word document text length: ${result.value.length}`);
        console.log('Word text extraction preview:', result.value.substring(0, 300));
        
        if (result.value.trim().length === 0) {
          throw new Error('No readable text found in Word document');
        }
        
        resolve(result.value);
      } catch (error) {
        console.error('Word extraction error:', error);
        reject(new Error(`Failed to extract text from Word document: ${error.message}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read Word file'));
    reader.readAsArrayBuffer(file);
  });
};
