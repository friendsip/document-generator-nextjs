import { NextResponse } from 'next/server';
import { Document, Packer, Paragraph } from 'docx';

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
              text: 'Test Document'
            }),
            new Paragraph({
              text: 'This is a simple test document.'
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