export const maxDuration = 60; // Set max duration to 60 seconds

import { NextResponse } from 'next/server';
import { 
  Document, 
  Packer, 
  Paragraph, 
  HeadingLevel, 
  AlignmentType,
  TextRun,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType
} from 'docx';

// Define types for industry and document type
type Industry = 'managed_it_services' | 'engineering';
type DocumentType = 'information_memorandum' | 'sales_prospectus' | 'business_overview' | 'investment_thesis';

// Industry-specific content definitions
const industryContent: Record<Industry, Record<DocumentType, string[]>> = {
  managed_it_services: {
    information_memorandum: [
      "Service Level Agreements (SLAs): Detail typical SLA commitments, uptime guarantees, and support response times.",
      "Recurring Revenue Models: Emphasize the stability and predictability of MRR/ARR from managed service contracts.",
      "Technology Stack & Vendor Partnerships: Describe key technologies utilized (e.g., RMM, PSA tools) and strategic partnerships (e.g., Microsoft, AWS, cybersecurity vendors).",
      "Cybersecurity Focus: Highlight expertise in cybersecurity services, compliance (e.g., GDPR, HIPAA if applicable), and data protection measures.",
      "Client Onboarding & Management: Outline the process for onboarding new clients and managing ongoing service delivery."
    ],
    sales_prospectus: [
      "Value Proposition for MSPs: Focus on how the acquisition/investment enhances service offerings, expands customer base, or improves operational efficiency in the MSP space.",
      "Scalability of Services: Highlight the potential to scale managed services across a broader client portfolio.",
      "Cross-selling Opportunities: Identify opportunities to cross-sell additional IT services (e.g., cloud solutions, cybersecurity, VoIP) to the existing client base."
    ],
    business_overview: [
      "Core MSP Offerings: Briefly list key managed services (e.g., network monitoring, helpdesk support, cloud management, data backup and recovery).",
      "Target Client Verticals (if any): Mention specific industries the MSP specializes in serving (e.g., healthcare, finance, legal)."
    ],
    investment_thesis: [
      "Growth Drivers in MSP Market: Discuss factors like increasing IT complexity, cybersecurity threats, and cloud adoption driving demand for MSPs.",
      "Competitive Moat for MSPs: Analyze factors such as customer stickiness, proprietary processes, or specialized expertise.",
      "Valuation Multiples for MSPs: Reference typical valuation metrics in the MSP sector (e.g., EV/EBITDA, EV/ARR)."
    ]
  },
  engineering: {
    information_memorandum: [
      "Project Portfolio & Case Studies: Showcase key projects completed, highlighting complexity, scale, and client satisfaction.",
      "Certifications & Compliance: Detail relevant industry certifications and adherence to regulatory and safety standards.",
      "Key Personnel & Expertise: Emphasize the qualifications and experience of senior engineers and project managers.",
      "Technology & Software Utilized: Describe specialized engineering software and technologies employed.",
      "Risk Management & Quality Assurance: Outline processes for project risk management and quality control."
    ],
    sales_prospectus: [
      "Strategic Fit for Engineering Firms: Focus on how the acquisition/investment provides access to new markets and specialized engineering talent.",
      "Intellectual Property (if any): Highlight any patents, proprietary designs, or unique engineering methodologies.",
      "Backlog & Pipeline: Discuss the current project backlog and potential future projects in the pipeline."
    ],
    business_overview: [
      "Core Engineering Disciplines: Briefly list primary areas of engineering expertise (e.g., structural, product design, process engineering).",
      "Key Client Sectors: Mention primary industries served (e.g., construction, manufacturing, aerospace, energy)."
    ],
    investment_thesis: [
      "Growth Drivers in Engineering Sector: Discuss factors like infrastructure spending, technological innovation, and demand for specialized engineering solutions.",
      "Competitive Advantages in Engineering: Analyze factors such as reputation, technical expertise, client relationships, or innovative solutions.",
      "Valuation Considerations for Engineering Firms: Reference typical valuation metrics for the engineering industry."
    ]
  }
};

// Industry display names for better formatting
const industryDisplayNames: Record<Industry, string> = {
  managed_it_services: "Managed IT Services",
  engineering: "Engineering"
};

export async function POST(request: Request) {
  try {
    console.log('Received document generation request');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { documentType, industry } = body as { documentType: DocumentType; industry: Industry };
    
    if (!documentType || !industry) {
      console.log('Missing required fields:', { documentType, industry });
      return NextResponse.json(
        { error: 'Missing document type or industry selection' },
        { status: 400 }
      );
    }
    
    console.log('Generating document for:', { documentType, industry });
    
    // Get current date
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const timestamp = currentDate.toISOString().slice(0, 19).replace(/[-T:]/g, '');
    
    // Format titles
    const industryTitle = industryDisplayNames[industry] || industry.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const documentTypeTitle = documentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Document metadata
    const companyName = "Entrepreneurs Hub Ltd.";
    const contactDetails = {
      address: "186 Fleet Street",
      city: "London",
      postalCode: "EC4A 2HS",
      country: "United Kingdom",
      phone: "+44 20 1234 5678",
      email: "contact@entrepreneurshub.co.uk",
      website: "www.entrepreneurshub.co.uk"
    };
    
    // Copyright information
    const copyrightInfo = "©2025 Cloud Development Group Limited. www.CloudDev.group - all rights reserved. Company Registration Number: 14580536";
    
    // Create paragraphs for the document
    const paragraphs = [
      // Cover Page
      new Paragraph({
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 3000, // Large space at top
          after: 400,
        },
        children: [
          new TextRun({
            text: documentTypeTitle,
            size: 56, // 28pt
            bold: true,
            color: "2E74B5",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 400,
          after: 400,
        },
        children: [
          new TextRun({
            text: `For ${industryTitle}`,
            bold: true,
            size: 32, // 16pt
            color: "2E74B5",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 400,
          after: 400,
        },
        children: [
          new TextRun({
            text: `Prepared for: Prospective Investor/Acquirer`,
            size: 24, // 12pt
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 400,
          after: 400,
        },
        children: [
          new TextRun({
            text: `Prepared by: ${companyName}`,
            size: 24, // 12pt
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 400,
          after: 800,
        },
        children: [
          new TextRun({
            text: `Date: ${formattedDate}`,
            size: 24, // 12pt
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 800,
        },
        children: [
          new TextRun({
            text: "(Company Logo Here)",
            size: 24, // 12pt
            italics: true,
            color: "989898",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 400,
          after: 0,
        },
        children: [
          new TextRun({
            text: copyrightInfo,
            size: 16, // 8pt
            color: "777777",
          }),
        ],
      }),
      new Paragraph({
        pageBreakBefore: true,
        children: [
          new TextRun({
            text: ""
          })
        ]
      }),
      
      // Disclaimer
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: "Disclaimer",
            size: 32, // 16pt
            bold: true,
            color: "2E74B5"
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "This document is confidential and has been prepared solely for informational purposes. It does not constitute an offer or solicitation. All information contained herein is subject to verification. Recipients should conduct their own due diligence and consult professional advisors.",
            size: 20, // 10pt
            italics: true,
          }),
        ],
      }),
      new Paragraph({
        spacing: {
          after: 400,
        },
        children: [
          new TextRun({
            text: ""
          })
        ]
      }),
      
      // Table of Contents (placeholder)
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: "Table of Contents",
            size: 32, // 16pt
            bold: true,
            color: "2E74B5"
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Executive Summary........................3"
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Company Overview......................4"
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Industry Analysis.........................5"
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Industry-Specific Content.............6"
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Financial Information..................7"
          })
        ]
      }),
      new Paragraph({
        pageBreakBefore: true,
        children: [
          new TextRun({
            text: ""
          })
        ]
      }),
      
      // Executive Summary
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: "Executive Summary",
            size: 32, // 16pt
            bold: true,
            color: "2E74B5"
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "This document provides a comprehensive overview of the business opportunity. It includes detailed information about the company, its operations, market position, and growth potential in the " + industryTitle + " sector."
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Key highlights include:"
          })
        ]
      }),
      new Paragraph({
        indent: {
          left: 360, // 0.25 inches
        },
        children: [
          new TextRun({
            text: "• Established position in the " + industryTitle + " market"
          })
        ]
      }),
      new Paragraph({
        indent: {
          left: 360, // 0.25 inches
        },
        children: [
          new TextRun({
            text: "• Strong recurring revenue model with high customer retention"
          })
        ]
      }),
      new Paragraph({
        indent: {
          left: 360, // 0.25 inches
        },
        children: [
          new TextRun({
            text: "• Scalable business model with significant growth potential"
          })
        ]
      }),
      new Paragraph({
        indent: {
          left: 360, // 0.25 inches
        },
        children: [
          new TextRun({
            text: "• Experienced management team with industry expertise"
          })
        ]
      }),
      new Paragraph({
        spacing: {
          after: 400,
        },
        children: [
          new TextRun({
            text: ""
          })
        ]
      }),
      
      // Company Overview section
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: "Company Overview",
            size: 32, // 16pt
            bold: true,
            color: "2E74B5"
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `${companyName} is a leading provider of solutions in the ${industryTitle} sector. The company offers a comprehensive range of services designed to meet the needs of businesses across various industries.`
          })
        ]
      }),
      
      // Industry-specific content 
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
        children: [
          new TextRun({
            text: `Industry-Specific Considerations: ${industryTitle}`,
            size: 32, // 16pt
            bold: true,
            color: "2E74B5"
          })
        ]
      }),
      
      // Key Considerations subheading
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: "Key Considerations",
            size: 28, // 14pt
            bold: true,
            color: "2E74B5"
          })
        ]
      }),
    ];
    
    // Add industry-specific content if available
    if (industryContent[industry] && industryContent[industry][documentType]) {
      industryContent[industry][documentType].forEach(content => {
        // Split content into title and description
        const parts = content.split(': ');
        if (parts.length > 1) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: parts[0] + ': ',
                  bold: true,
                }),
                new TextRun(parts[1]),
              ],
              spacing: {
                before: 200,
                after: 120,
              },
            })
          );
        } else {
          paragraphs.push(
            new Paragraph({
              spacing: {
                before: 120,
                after: 120,
              },
              children: [
                new TextRun({
                  text: content
                })
              ]
            })
          );
        }
      });
    }
    
    // Add Financial Information section
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
        children: [
          new TextRun({
            text: "Financial Information",
            size: 32, // 16pt
            bold: true,
            color: "2E74B5"
          })
        ]
      })
    );
    
    // Fixed the italics attribute by using TextRun
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "This section would typically contain detailed financial information including historical performance, projections, and key financial metrics relevant to the business and industry.",
            italics: true,
          })
        ]
      })
    );
    
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "For the purposes of this template, this section is presented as a placeholder. In a complete document, you would include:"
          })
        ]
      })
    );
    
    paragraphs.push(
      new Paragraph({
        indent: {
          left: 360, // 0.25 inches
        },
        children: [
          new TextRun({
            text: "• Income Statements (3-5 years historical and projections)"
          })
        ]
      })
    );
    
    paragraphs.push(
      new Paragraph({
        indent: {
          left: 360, // 0.25 inches
        },
        children: [
          new TextRun({
            text: "• Balance Sheets"
          })
        ]
      })
    );
    
    paragraphs.push(
      new Paragraph({
        indent: {
          left: 360, // 0.25 inches
        },
        children: [
          new TextRun({
            text: "• Cash Flow Statements"
          })
        ]
      })
    );
    
    paragraphs.push(
      new Paragraph({
        indent: {
          left: 360, // 0.25 inches
        },
        children: [
          new TextRun({
            text: "• Key Performance Indicators specific to the industry"
          })
        ]
      })
    );
    
    // Conclusion
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
        children: [
          new TextRun({
            text: "Conclusion",
            size: 32, // 16pt
            bold: true,
            color: "2E74B5"
          })
        ]
      })
    );
    
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `This ${documentTypeTitle} has outlined the key aspects of the business opportunity in the ${industryTitle} sector. The company offers significant potential for growth and value creation through its established market position, experienced management team, and scalable business model.`
          })
        ]
      })
    );
    
    paragraphs.push(
      new Paragraph({
        spacing: {
          before: 400,
          after: 200,
        },
        children: [
          new TextRun({
            text: "For further information, please contact:"
          })
        ]
      })
    );
    
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: companyName,
            bold: true,
          })
        ]
      })
    );
    
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactDetails.address
          })
        ]
      })
    );
    
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${contactDetails.city}, ${contactDetails.postalCode}`
          })
        ]
      })
    );
    
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactDetails.country
          })
        ]
      })
    );
    
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Phone: ${contactDetails.phone}`
          })
        ]
      })
    );
    
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Email: ${contactDetails.email}`
          })
        ]
      })
    );
    
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Website: ${contactDetails.website}`
          })
        ]
      })
    );
    
    // Add copyright to the final page
    paragraphs.push(
      new Paragraph({
        spacing: {
          before: 600,
        },
        children: [
          new TextRun({
            text: ""
          })
        ]
      })
    );
    
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: copyrightInfo,
            size: 16, // 8pt
            color: "777777",
          })
        ]
      })
    );
    
    // Now create the document with all paragraphs
    const doc = new Document({
      title: `${documentTypeTitle} for ${industryTitle}`,
      description: `Generated ${documentTypeTitle} for ${industryTitle} industry`,
      styles: {
        paragraphStyles: [
          {
            id: "Normal",
            name: "Normal",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 24, // 12pt
              font: "Calibri",
              color: "000000",
            },
            paragraph: {
              spacing: { line: 276, before: 0, after: 200 },
            },
          },
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 32, // 16pt
              bold: true,
              font: "Calibri",
              color: "2E74B5",
            },
            paragraph: {
              spacing: { before: 240, after: 120 },
            },
          },
          {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 28, // 14pt
              bold: true,
              font: "Calibri",
              color: "2E74B5",
            },
            paragraph: {
              spacing: { before: 240, after: 120 },
            },
          },
          {
            id: "Title",
            name: "Title",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 56, // 28pt
              bold: true,
              font: "Calibri",
              color: "2E74B5",
            },
            paragraph: {
              spacing: { before: 240, after: 240 },
              alignment: AlignmentType.CENTER,
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: paragraphs,
        },
      ],
    });
    
    // Add a table to the document - insert after the company overview text
    // Find the paragraph after "Company Overview" text
    // Define type for our paragraph structure
    interface ParagraphWithChildren {
      children?: Array<{ text?: string }>;
    }
    
    let companyOverviewIndex = -1;
    for (let i = 0; i < paragraphs.length; i++) {
      // Type cast paragraph to access children safely
      const paragraph = paragraphs[i] as unknown as ParagraphWithChildren;
      
      // Search for company overview paragraph by checking TextRun content
      if (paragraph.children && 
          paragraph.children[0] && 
          paragraph.children[0].text === `${companyName} is a leading provider of solutions in the ${industryTitle} sector. The company offers a comprehensive range of services designed to meet the needs of businesses across various industries.`) {
        companyOverviewIndex = i;
        break;
      }
    }
    
    if (companyOverviewIndex !== -1) {
      // Create a table to insert
      const table = new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        borders: {
          top: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: "AAAAAA",
          },
          bottom: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: "AAAAAA",
          },
          left: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: "AAAAAA",
          },
          right: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: "AAAAAA",
          },
          insideHorizontal: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: "AAAAAA",
          },
          insideVertical: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: "AAAAAA",
          },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: {
                  size: 30,
                  type: WidthType.PERCENTAGE,
                },
                shading: {
                  fill: "EEF0F2",
                  type: ShadingType.SOLID,
                },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Company Name",
                        bold: true,
                      })
                    ]
                  }),
                ],
              }),
              new TableCell({
                width: {
                  size: 70,
                  type: WidthType.PERCENTAGE,
                },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: companyName
                      })
                    ]
                  }),
                ],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                width: {
                  size: 30,
                  type: WidthType.PERCENTAGE,
                },
                shading: {
                  fill: "EEF0F2",
                  type: ShadingType.SOLID,
                },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Industry",
                        bold: true,
                      })
                    ]
                  }),
                ],
              }),
              new TableCell({
                width: {
                  size: 70,
                  type: WidthType.PERCENTAGE,
                },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: industryTitle
                      })
                    ]
                  }),
                ],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                width: {
                  size: 30,
                  type: WidthType.PERCENTAGE,
                },
                shading: {
                  fill: "EEF0F2",
                  type: ShadingType.SOLID,
                },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Location",
                        bold: true,
                      })
                    ]
                  }),
                ],
              }),
              new TableCell({
                width: {
                  size: 70,
                  type: WidthType.PERCENTAGE,
                },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${contactDetails.city}, ${contactDetails.country}`
                      })
                    ]
                  }),
                ],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                width: {
                  size: 30,
                  type: WidthType.PERCENTAGE,
                },
                shading: {
                  fill: "EEF0F2",
                  type: ShadingType.SOLID,
                },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Contact",
                        bold: true,
                      })
                    ]
                  }),
                ],
              }),
              new TableCell({
                width: {
                  size: 70,
                  type: WidthType.PERCENTAGE,
                },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${contactDetails.email} | ${contactDetails.phone}`
                      })
                    ]
                  }),
                ],
              }),
            ],
          }),
        ],
      });
      
      // Need to access doc.sections - use type assertion for TypeScript
      interface DocumentWithSections {
        sections: Array<{ children: any[] }>;
      }
      
      // Insert the table after company overview text
      (doc as unknown as DocumentWithSections).sections[0].children.splice(companyOverviewIndex + 1, 0, table);
      
      // Add a blank paragraph after the table
      (doc as unknown as DocumentWithSections).sections[0].children.splice(companyOverviewIndex + 2, 0, 
        new Paragraph({
          spacing: {
            after: 200,
          },
          children: [
            new TextRun({
              text: ""
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
    
    // Return the document as a downloadable file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error generating document:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    );
  }
}