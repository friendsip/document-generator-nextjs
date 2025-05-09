import { NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';

export async function GET() {
  try {
    console.log('Creating simple test document');
    
    // Create a simple document with just one paragraph
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Test Document',
                  bold: true,
                  size: 32
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'This is a simple test document.'
                })
              ]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: '©2025 Cloud Development Group Limited. www.CloudDev.group - all rights reserved. Company Registration Number: 14580536',
                  size: 16,
                  color: '777777'
                })
              ]
            })
          ]
        }
      ]
    });
    
    console.log('Packing document');
    const buffer = await Packer.toBuffer(doc);
    console.log('Document packed successfully', buffer.length, 'bytes');
    
    // Return the document as a downloadable file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="test-document.docx"',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error generating test document:', error);
    return NextResponse.json(
      { error: 'Failed to generate test document' },
      { status: 500 }
    );
  }
}