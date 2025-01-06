# IQSuite JavaScript/TypeScript SDK

A JavaScript/TypeScript SDK for interacting with the IQSuite API.

## Installation

```bash
npm install iqsuite  # From NPM
# or
npm install github:blue-hex/iqsuite-js  # From GitHub
```

## Usage

### TypeScript
```typescript
import { IQSuiteClient } from 'iqsuite';

const client = new IQSuiteClient({
    apiKey: 'your-api-key',
    verifySsl: false // for development/testing
});

// Get user info
const user = await client.getUser();

// List all indexes
const indexes = await client.listIndexes();

// Create new index
const buffer = fs.readFileSync('document.pdf');
const task = await client.createIndex(buffer, 'document.pdf');
console.log(`Task ID: ${task.task_id}`);

// Check task status
const status = await client.getTaskStatus(task.task_id);

// Add document to index
const newDoc = fs.readFileSync('new_document.pdf');
const addTask = await client.addDocument(indexId, newDoc, 'new_document.pdf');

// Get all documents in an index
const documents = await client.getDocuments(indexId);

// Chat with documents
const chatResponse = await client.chat(indexId, "What is machine learning?");

// Search documents
const searchResults = await client.search(indexId, "neural networks");

// Delete a document
await client.deleteDocument(indexId, documentId);
```

### JavaScript
```javascript
const { IQSuiteClient } = require('iqsuite');

const client = new IQSuiteClient({
    apiKey: 'your-api-key'
});

// Use the same methods as TypeScript example
// All methods return Promises
```

## Development

1. Clone the repository:
```bash
git clone https://github.com/blue-hex/iqsuite-js.git
cd iqsuite-js
```

2. Install dependencies:
```bash
npm install
```

3. Build the package:
```bash
npm run build
```