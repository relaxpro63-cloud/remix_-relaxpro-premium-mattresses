import { LeadFormData } from '../types';

export async function submitLead(data: LeadFormData): Promise<boolean> {
  try {
    const meta = import.meta as { env?: Record<string, string | undefined> };
    const envUrl = meta.env?.VITE_PUBLIC_GOOGLE_SCRIPT_URL || meta.env?.VITE_GOOGLE_SCRIPT_URL || meta.env?.PUBLIC_GOOGLE_SCRIPT_URL;
    const scriptUrl = envUrl || 'https://script.google.com/macros/s/AKfycbzgXC8FNv61wwPtzetZqEa8n_pR6PmrWe0unhZ20wlVLwkMrp9VMGnEpDX_OSIxzWnH/exec';

    console.log("Attempting to submit lead data to Google Sheet:", data);

    if (!scriptUrl) {
      console.warn("Google Apps Script URL is not configured. Please add VITE_PUBLIC_GOOGLE_SCRIPT_URL to your environment secrets in settings.");
      return false;
    }

    // Google Apps Script doPost(e) parses e.parameter only when sent as:
    // 1. URL search params (query parameters)
    // 2. application/x-www-form-urlencoded body
    // If sent as raw application/json under no-cors, e.parameter remains entirely empty!
    // To solve this and make it compatible with BOTH parameter-based and JSON-body-based Apps Scripts:
    
    // Create urlSearchParams for application/x-www-form-urlencoded
    const formParams = new URLSearchParams();
    
    // Add all keys
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const val = data[key];
        formParams.append(key, val !== undefined && val !== null ? String(val) : "");
      }
    }
    
    // Also include a raw "payload" or "json" parameter representing the full JSON object
    // just in case the Apps Script expects JSON parsing on a specific parameter
    formParams.append("payload", JSON.stringify(data));
    formParams.append("json", JSON.stringify(data));

    // Also support appending essential params to the query URL for maximum script compatibility
    const urlWithParams = new URL(scriptUrl);
    // Add name and phone to query params to guarantee they appear in standard parameter-based catchers
    if (data.name) urlWithParams.searchParams.append("name", String(data.name));
    if (data.phone) urlWithParams.searchParams.append("phone", String(data.phone));
    if (data.orderId) urlWithParams.searchParams.append("orderId", String(data.orderId));
    if (data.product) urlWithParams.searchParams.append("product", String(data.product));

    await fetch(
      urlWithParams.toString(),
      {
        method: "POST",
        mode: "no-cors", // Required to bypass CORS blocks on Google Apps Script Web Apps
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formParams.toString()
      }
    );

    console.log("Successfully dispatched fetch request to Google Apps Script Web App.");
    return true;
  } catch (error) {
    console.error("Error submitting lead to Google Sheets:", error);
    return false;
  }
}
