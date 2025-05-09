import { Document, Packer, Paragraph, HeadingLevel, AlignmentType, TextRun } from 'docx';

// Define types for industry and document type
export type Industry = 'managed_it_services' | 'engineering';
export type DocumentType = 'information_memorandum' | 'sales_prospectus' | 'business_overview' | 'investment_thesis';

// Industry-specific content definitions
const industryContent: Record<Industry, Record<DocumentType, string[]>> = {
  managed_it_services: {
    information_memorandum: [
      "Service Level Agreements (SLAs): Detail typical SLA commitments.",
      "Recurring Revenue Models: Emphasize the stability of MRR/ARR."
    ],
    sales_prospectus: [
      "Value Proposition for MSPs: Focus on service offerings.",
      "Scalability of Services: Highlight scaling potential."
    ],
    business_overview: [
      "Core MSP Offerings: List key managed services.",
      "Target Client Verticals: Mention specific industries served."
    ],
    investment_thesis: [
      "Growth Drivers in MSP Market: Discuss market factors.",
      "Competitive Moat for MSPs: Analyze customer stickiness."
    ]
  },
  engineering: {
    information_memorandum: [
      "Project Portfolio: Showcase key projects completed.",
      "Certifications & Compliance: Detail industry certifications."
    ],
    sales_prospectus: [
      "Strategic Fit: Focus on market access.",
      "Intellectual Property: Highlight patents and designs."
    ],
    business_overview: [
      "Core Engineering Disciplines: List expertise areas.",
      "Key Client Sectors: Mention industries served."
    ],
    investment_thesis: [
      "Growth Drivers: Discuss infrastructure spending.",
      "Competitive Advantages: Analyze technical expertise."
    ]
  }
};

export async function createDocument(documentType: DocumentType, industry: Industry) {
  try {
    console.log('Starting document creation');
    
    // Get current date
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const timestamp = currentDate.toISOString().slice(0, 19).replace(/[-T:]/g, '');
    
    // Format titles
    const industryTitle = industry.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const documentTypeTitle = documentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    console.log('Creating document with docx library');
    
    // Create a basic document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: documentTypeTitle,
                bold: true,
                size: 32
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Date: ${formattedDate}`
              })
            ]
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: "Executive Summary",
                bold: true,
                size: 28
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "This document provides a comprehensive overview."
              })
            ]
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: `Industry-Specific Considerations: ${industryTitle}`,
                bold: true,
                size: 24
              })
            ]
          })
        ]
      }]
    });
    
    // Add industry-specific content if available
    if (industryContent[industry] && industryContent[industry][documentType]) {
      // Define interface to access doc.sections with TypeScript
      interface DocumentWithSections {
        sections: Array<{ 
          addChildElement: (element: any) => void 
        }>;
      }
      
      // Cast document to our type
      const typedDoc = doc as unknown as DocumentWithSections;
      const contentSection = typedDoc.sections[0];
      
      industryContent[industry][documentType].forEach(content => {
        contentSection.addChildElement(
          new Paragraph({
            children: [
              new TextRun({
                text: content
              })
            ]
          })
        );
      });
      
      contentSection.addChildElement(
        new Paragraph({
          children: [
            new TextRun({
              text: "[End of Industry-Specific Section]",
              italics: true
            })
          ]
        })
      );
    }
    
    console.log('Document created, packing...');
    
    // Generate filename
    const filename = `${documentType}_${industry}_${timestamp}.docx`;
    
    // Create buffer from document
    const buffer = await Packer.toBuffer(doc);
    
    console.log('Document packed successfully', buffer.length, 'bytes');
    return { buffer, filename };
  } catch (error) {
    console.error('Error in createDocument:', error);
    throw error;
  }
}