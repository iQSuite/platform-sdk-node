# IQSuite TypeScript/JavaScript SDK

IQSuite is a powerful Retrieval Augmented Generation (RAG) and Hybrid Search platform that enables you to build intelligent document processing and question-answering systems. This SDK provides a convenient way to interact with the IQSuite API using TypeScript or JavaScript.

## Features

- Create and manage searchable document indices
- Upload and process various document formats (PDF, Word, PowerPoint, Images)
- Perform hybrid semantic search across documents
- Chat with your documents using natural language
- Create instant RAG systems from text content
- Build production-ready document Q&A systems
- Full TypeScript support with comprehensive type definitions

## Installation

```bash
# Using npm
npm install iqsuite

# Using yarn
yarn add iqsuite

# Using pnpm 
pnpm add iqsuite

# From GitHub (for development/testing)
npm install github:blue-hex/iqsuite-platform-js-sdk
```

## Authentication

Before using the SDK, you'll need to obtain an API key:

1. Visit [https://iqsuite.ai](https://iqsuite.ai)
2. Create an account or log in
3. Navigate to "API Keys" in your dashboard
4. Generate a new API key



### Document Management

#### Create Index with Document

```typescript

import { IQSuiteClient } from 'iqsuite';

// Initialize the client
const client = new IQSuiteClient({
    apiKey: 'your-api-key'
});


// Create index with automatic polling
try {
    const fileBuffer = fs.readFileSync('document.pdf');
    const [response, status] = await client.createIndexAndPoll(
        fileBuffer,
        'document.pdf',
        5,     // Maximum polling attempts
        5000   // Polling interval in milliseconds
    );

    console.log(`Index created with ID: ${response.data.index_id}`);
    console.log(`Final status: ${status.status}`);
} catch (error) {
    console.error('Index creation failed:', error.message);
}

// Create index without polling
const response = await client.createIndex(fileBuffer, 'document.pdf');
console.log(`Task ID: ${response.data.task_id}`);
```

#### Add Documents to Index

```typescript
// Add document with automatic polling
try {
    const fileBuffer = fs.readFileSync('new_document.docx');
    const [response, status] = await client.addDocumentAndPoll(
        'your-index-id',
        fileBuffer,
        'new_document.docx'
    );

    console.log(`Document added, task ID: ${response.data.task_id}`);
    console.log(`Final status: ${status.status}`);
} catch (error) {
    console.error('Document addition failed:', error.message);
}
```

#### List Documents in Index

```typescript
const documents = await client.getDocuments('your-index-id');
for (const doc of documents.data.documents) {
    console.log(`Document ID: ${doc.id}`);
    console.log(`Created: ${doc.created_at}`);
}
```

#### Delete Document

```typescript
await client.deleteDocument('your-index-id', 'document-id');
```

### Search and Retrieval

#### Chat with Documents

```typescript
const chatResponse = await client.chat(
    'your-index-id',
    "What are the main conclusions in this document?"
);

console.log('Response:', chatResponse.answer);
console.log('Source passages:', chatResponse.sources);
```

#### Search Documents

```typescript
const searchResults = await client.search(
    'your-index-id',
    "machine learning applications"
);

for (const result of searchResults.matches) {
    console.log(`Score: ${result.score}`);
    console.log(`Content: ${result.content}`);
}
```

### Instant RAG

Create and query instant RAG systems for quick text-based Q&A:

```typescript
// Create instant RAG
const context = "Your text content here (max 8000 tokens)";
const ragResponse = await client.createInstantRag(context);
console.log(`RAG ID: ${ragResponse.data.id}`);

// Query instant RAG
const queryResponse = await client.queryInstantRag(
    ragResponse.data.id,
    "What are the key points?"
);

console.log(`Answer: ${queryResponse.data.retrieval_response}`);
console.log(`Tokens used: ${queryResponse.data.total_tokens}`);
```


## Supported File Types

The SDK supports the following file formats:

- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- Microsoft PowerPoint (.ppt, .pptx)
- Images (.jpg, .jpeg, .png, .tiff, .bmp)

## Error Handling

The SDK provides two main error types:

```typescript
import { AuthenticationError, APIError } from 'iqsuite';

try {
    await client.createIndex(fileBuffer, 'document.pdf');
} catch (error) {
    if (error instanceof AuthenticationError) {
        // Handle authentication errors
        console.error('Invalid API key');
    } else if (error instanceof APIError) {
        // Handle API-specific errors
        console.error(`API Error (${error.statusCode}):`, error.message);
    } else {
        // Handle other errors
        console.error('Unexpected error:', error);
    }
}
```

## Best Practices

1. **Error Handling**: Always wrap API calls in try-catch blocks
2. **Polling**: Use the polling methods for long-running operations
3. **File Size**: Be mindful of file size limits when uploading documents
4. **Rate Limits**: Implement appropriate rate limiting in your application
5. **Security**: Never expose your API key in client-side code

## TypeScript Support

The SDK includes comprehensive TypeScript declarations. All interfaces and types are exported and can be imported:

```typescript
import {
    User,
    Index,
    Document,
    TaskStatus,
    TaskResponse,
    DocumentListResponse,
    InstantRagResponse,
    InstantRagQueryResponse
} from 'iqsuite';
```

## Support

- Documentation: [https://docs.iqsuite.ai](https://docs.iqsuite.ai)
- Issues: [GitHub Issues](https://github.com/blue-hex/iqsuite-platform-js-sdk/issues)
- Email: support@iqsuite.ai
