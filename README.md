# Document Generator - Next.js Implementation

This is a Next.js implementation of the Entrepreneurs Hub document template generator, originally built in Flask.

## Features

- Generate customized business documents for different industries
- Four document types: Information Memorandum, Sales Prospectus, Business Overview, Investment Thesis
- Support for different industries: Managed IT Services, Engineering
- Modern UI built with React and TailwindCSS
- Document generation handled by docx.js library

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `src/app/` - Next.js app router files
- `src/components/` - React components
- `src/lib/` - Document generation library
- `src/templates/` - Document templates
- `src/generated-documents/` - Output directory for generated documents

## Adding New Document Types

1. Create a new template definition in `src/lib/templates.ts`
2. Add the new option to the select element in `src/components/DocumentForm.tsx`
3. Add industry-specific content for the new document type in `src/lib/documentGenerator.ts`

## Adding New Industries

1. Add the new industry to the select element in `src/components/DocumentForm.tsx`
2. Add industry-specific content for all document types in `src/lib/documentGenerator.ts`

## Technologies Used

- Next.js 14
- React 18
- TailwindCSS
- docx.js
- React Hook Form