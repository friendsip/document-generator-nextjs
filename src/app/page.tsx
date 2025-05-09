'use client';

import DocumentForm from '@/components/DocumentForm';
import { useState } from 'react';

export default function Home() {
  const [testStatus, setTestStatus] = useState<string | null>(null);
  
  const handleTestDownload = async () => {
    try {
      setTestStatus('Testing...');
      const response = await fetch('/api/test');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'test-document.docx';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setTestStatus('Test successful!');
    } catch (error) {
      console.error('Test download failed:', error);
      setTestStatus(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Entrepreneurs Hub Document Template Generator
          </h1>
          <DocumentForm />
          
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Having trouble? Try our test document:
            </p>
            <button 
              onClick={handleTestDownload}
              className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
            >
              Download Test Document
            </button>
            {testStatus && (
              <p className={`mt-2 text-sm ${testStatus.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
                {testStatus}
              </p>
            )}
          </div>
        </div>
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>©2025 Cloud Development Group Limited. <a href="https://www.CloudDev.group" className="hover:underline">www.CloudDev.group</a> - all rights reserved. Company Registration Number: 14580536</p>
        </div>
      </div>
    </main>
  );
}