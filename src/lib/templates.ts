import { Document, Paragraph, TextRun, HeadingLevel } from 'docx';

// This file contains the template definitions for different document types
// In a real implementation, these might be loaded from template files

interface TemplateSection {
  title: string;
  content: string | { [key: string]: string };
}

interface DocumentTemplate {
  title: string;
  sections: TemplateSection[];
}

// Document template definitions
const templates: { [key: string]: DocumentTemplate } = {
  information_memorandum: {
    title: "Information Memorandum",
    sections: [
      {
        title: "Disclaimer",
        content: "This Information Memorandum ('IM') is confidential and has been prepared by [CompanyName] solely for informational purposes... [Add full standard disclaimer text here]."
      },
      {
        title: "Executive Summary",
        content: "[Provide a concise overview of the company, the opportunity, key investment highlights, and the purpose of this memorandum. This section is typically written last but placed first.]"
      },
      {
        title: "Company Overview",
        content: {
          "Introduction": "[Brief introduction to the company.]",
          "History": "[Company's history, milestones, and evolution.]",
          "Mission & Vision": "[Company's mission statement and long-term vision.]",
          "Legal Structure & Ownership": "[Details of the company's legal structure (e.g., Ltd, LLC) and ownership.]",
          "Location & Facilities": "[Description of primary locations, offices, and facilities.]"
        }
      },
      {
        title: "Products/Services",
        content: "[Detailed description of the company's products and/or services, including unique selling propositions (USPs), competitive advantages, and any intellectual property (patents, trademarks). Use subheadings if multiple distinct products/services.]"
      }
      // More sections would be defined here in a full implementation
    ]
  },
  sales_prospectus: {
    title: "Sales Prospectus",
    sections: [
      {
        title: "Executive Summary",
        content: "[Brief overview of the sales opportunity]"
      },
      {
        title: "Investment Highlights",
        content: "[Key reasons why this opportunity is attractive]"
      },
      {
        title: "Market Analysis",
        content: "[Analysis of the target market and opportunity]"
      }
      // More sections would be defined here in a full implementation
    ]
  },
  business_overview: {
    title: "Business Overview",
    sections: [
      {
        title: "Company Introduction",
        content: "[Brief introduction to the business]"
      },
      {
        title: "Operations Summary",
        content: "[Overview of key operational aspects]"
      },
      {
        title: "Financial Highlights",
        content: "[Key financial metrics and performance]"
      }
      // More sections would be defined here in a full implementation
    ]
  },
  investment_thesis: {
    title: "Investment Thesis",
    sections: [
      {
        title: "Investment Summary",
        content: "[Overview of the investment opportunity]"
      },
      {
        title: "Investment Rationale",
        content: "[Key reasons supporting the investment]"
      },
      {
        title: "Risk Analysis",
        content: "[Assessment of potential risks and mitigations]"
      }
      // More sections would be defined here in a full implementation
    ]
  }
};

// Function to get a document template
export function getDocumentTemplate(documentType: string): DocumentTemplate {
  if (!templates[documentType]) {
    throw new Error(`Template for document type '${documentType}' not found`);
  }
  return templates[documentType];
}