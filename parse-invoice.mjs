// Simple Node.js example for calling the Parserdata API with a multipart upload

import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import FormData from "form-data";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config

const apiKey = process.env.PARSERDATA_API_KEY;
const apiUrl = "https://api.parserdata.com/v1/extract";

// Allow passing file path as CLI argument, default to ./invoice.pdf
const inputFilePath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(__dirname, "invoice.pdf");

// Basic safety checks

if (!apiKey || apiKey === "YOUR_API_KEY") {
  console.error(
    "Missing PARSERDATA_API_KEY.\n" +
      "   Set it as an environment variable, for example:\n" +
      "   export PARSERDATA_API_KEY=\"your_api_key_here\""
  );
  process.exit(1);
}

if (!fs.existsSync(inputFilePath)) {
  console.error(
    `Input file not found: ${inputFilePath}\n` +
      "   Place an invoice file in the repo root as invoice.pdf\n" +
      "   or pass a path explicitly: node parse-invoice.mjs ./path/to/file.pdf"
  );
  process.exit(1);
}

// Main logic

async function run() {
  console.log("Using file:", inputFilePath);
  console.log("Sending request to Parserdata API...");

  const form = new FormData();

  // Natural-language prompt describing what to extract
  form.append(
    "prompt",
    "Extract invoice number, invoice date, supplier name, total amount, and line items (description, quantity, unit price, net amount)."
  );

  // Optional extraction options
  form.append(
    "options",
    JSON.stringify({
      return_schema: false,
      return_selected_fields: false,
    })
  );

  // Attach the file stream
  form.append("file", fs.createReadStream(inputFilePath));

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        ...form.getHeaders(),
      },
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("Request failed with status:", response.status, response.statusText);
      if (errorText) {
        console.error("Response body:");
        console.error(errorText);
      }
      process.exit(1);
    }

    const data = await response.json();
    console.log("Parsed data:\n");
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Unexpected error while calling Parserdata API:");
    console.error(err);
    process.exit(1);
  }
}

// Run the script
run();
