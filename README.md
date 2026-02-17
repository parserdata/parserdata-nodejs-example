
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Parserdata API](https://img.shields.io/badge/Parserdata-API-green)](https://parserdata.com/)

# Parserdata Node.js API Example

Node.js example for using the **Parserdata Financial Data Extraction API** to extract structured data from invoices and financial documents.

This repository demonstrates how to upload a document using multipart/form-data and receive clean, structured JSON in response.

---

## ✨ Features

- Upload PDFs and documents via multipart form
- Extract invoice data using natural-language prompts
- Simple Node.js example using `node-fetch`
- Works with any invoice or financial document

---

## 📦 Requirements

- Node.js **16+**
- A Parserdata API key

---

## 🔑 Get an API Key

1. Sign up at **https://parserdata.com**
2. Create an API key in your dashboard
3. Export it as an environment variable:

```bash
export PARSERDATA_API_KEY="YOUR_API_KEY"
```

Windows (PowerShell):
```
$env:PARSERDATA_API_KEY="YOUR_API_KEY"
```

## 📥 Installation
Clone the repository and install dependencies:

```
git clone https://github.com/parserdata/parserdata-nodejs-example.git
cd parserdata-nodejs-example
npm install
```

Dependencies used:

- node-fetch

- form-data

## Basic Usage
Create a file called parse-invoice.mjs:

```
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";

const apiKey = process.env.PARSERDATA_API_KEY;
const url = "https://api.parserdata.com/v1/extract";

async function run() {
  const form = new FormData();

  form.append(
    "prompt",
    "Extract invoice number, invoice date, supplier name, total amount, and line items (description, quantity, unit price, net amount)."
  );

  form.append(
    "options",
    JSON.stringify({
      return_schema: false,
      return_selected_fields: false
    })
  );

  form.append("file", fs.createReadStream("./invoice.pdf"));

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
      ...form.getHeaders()
    },
    body: form
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

run();
```

Run the script:

```
node parse-invoice.mjs
```

 ## Response
 
The API returns structured JSON containing the extracted fields, for example:

```
{
  "invoice_number": "INV-2024-001",
  "invoice_date": "2024-01-12",
  "supplier_name": "Acme Corp",
  "total_amount": 1234.56,
  "line_items": [
    {
      "description": "Consulting services",
      "quantity": 1,
      "unit_price": 1234.56,
      "net_amount": 1234.56
    }
  ]
}
```

## How extraction works

Parserdata uses natural-language prompts to understand what data you want to extract.
You can freely modify the prompt field to match your document structure or schema needs.

## License

MIT

---

## Need help or a custom setup?

This repository is a reference example.

If you need help tailoring it to your workflow, or want advice on a more advanced Parserdata API integration (custom schemas, scale, or production use), reach out to us: support@parserdata.com
