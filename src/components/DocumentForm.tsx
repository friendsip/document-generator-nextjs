'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  documentType: string;
  industry: string;
};

export default function DocumentForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      documentType: 'information_memorandum',
      industry: 'managed_it_services',
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsGenerating(true);
      setError(null);
      
      console.log('Submitting form data:', data);
      
      // Use the Fetch API to download the file directly
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        // Try to get error details from the response
        let errorMsg = 'Failed to generate document';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch {
          // If response is not JSON, use status text
          errorMsg = `Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMsg);
      }
      
      // Get file name from the Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'generated-document.docx';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      console.log('Creating download for:', filename);
      
      // Create a blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Download initiated');
    } catch (err) {
      console.error('Error generating document:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-2">
          Select Document Type:
        </label>
        <select
          id="documentType"
          {...register('documentType', { required: 'Document type is required' })}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="information_memorandum">Information Memorandum</option>
          <option value="sales_prospectus">Sales Prospectus</option>
          <option value="business_overview">Business Overview</option>
          <option value="investment_thesis">Investment Thesis</option>
        </select>
        {errors.documentType && (
          <p className="mt-1 text-sm text-red-600">{errors.documentType.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
          Select Industry:
        </label>
        <select
          id="industry"
          {...register('industry', { required: 'Industry is required' })}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="managed_it_services">Managed IT Services</option>
          <option value="engineering">Engineering</option>
        </select>
        {errors.industry && (
          <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
        )}
      </div>
      
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={isGenerating}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? 'Generating Document...' : 'Generate Document'}
      </button>
    </form>
  );
}