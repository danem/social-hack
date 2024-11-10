import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import OpenAI from 'openai';

type LegalDraftProps = {
  clientName: string;
  clientLocation: string;
};

// Initialize OpenAI client
const openaiClient = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function generateFilledPDF(templateBytes: Uint8Array, formData: any) {
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  Object.keys(formData).forEach(fieldName => {
    try {
      const field = form.getTextField(fieldName);
      if (field) {
        field.setText(formData[fieldName]);
      }
    } catch (error) {
      console.error(`Error setting field "${fieldName}":`, error);
    }
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export function LegalDraft({ clientName, clientLocation }: LegalDraftProps) {
  const [generatedPdf, setGeneratedPdf] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLoading(true);
      const file = event.target.files[0];
      const fileBuffer = await file.arrayBuffer();

      try {
        const pdfDoc = await PDFDocument.load(fileBuffer);
        const form = pdfDoc.getForm();
        const fieldNames = form.getFields().map(field => field.getName());
        console.log('Form Field Names:', fieldNames);

        const prompt = `
          Generate a JSON object with realistic data to fill the fields of a tenant petition form.
          Field names are: ${fieldNames.join(', ')}
          Include the client's name: ${clientName} and location: ${clientLocation} in appropriate fields.

          Format:
          {
            "fieldName1": "Value1",
            "fieldName2": "Value2",
            ...
          }
        `;

        const response = await openaiClient.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an assistant that generates valid JSON data for filling out a form. Your response should ONLY be a JSON object.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        });

        const formData = JSON.parse(response.choices[0].message?.content.trim());
        console.log('Generated Form Data:', formData);

        const filledPdfBytes = await generateFilledPDF(new Uint8Array(fileBuffer), formData);
        setGeneratedPdf(filledPdfBytes);
      } catch (error) {
        console.error('Error parsing JSON or processing PDF:', error);
        alert('Failed to process the PDF or parse GPT response as JSON. Please check the format.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownload = () => {
    if (generatedPdf) {
      const blob = new Blob([generatedPdf], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'filled_out_tenant_petition.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Generate Legal Draft</h2>
      <p className="text-gray-600 mb-2">Upload the tenant petition form to pre-fill it with GPT-generated data.</p>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept="application/pdf"
          className="border border-gray-300 rounded-lg p-2"
          onChange={handleFileUpload}
        />
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
            <span className="text-blue-500">Generating PDF...</span>
          </div>
        ) : (
          generatedPdf && (
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
              onClick={handleDownload}
            >
              Download Filled PDF
            </button>
          )
        )}
      </div>
    </section>
  );
}