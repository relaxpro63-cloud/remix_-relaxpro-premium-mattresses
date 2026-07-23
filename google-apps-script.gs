/**
 * ═══════════════════════════════════════════════════════════════
 * RELAXPRO PREMIUM MATTRESSES — Unified Lead Capture Script
 * ═══════════════════════════════════════════════════════════════
 *
 * PURPOSE:
 *   Single Google Apps Script Web App that receives form submissions
 *   from ALL forms on the RelaxPro website and writes them to one
 *   Google Sheet for centralized lead management.
 *
 * FORMS INTEGRATED:
 *   ┌─────────────────────┬──────────────────────────┐
 *   │ Form                │ source value             │
 *   ├─────────────────────┼──────────────────────────┤
 *   │ Lead Popup          │ Popup                    │
 *   │ Consultation Form   │ Consultation Form        │
 *   │ Showroom Booking    │ Showroom Booking Form    │
 *   │ Cart / Checkout     │ Website Order Checkout   │
 *   └─────────────────────┴──────────────────────────┘
 *
 * ─── DEPLOYMENT INSTRUCTIONS ──────────────────────────────
 *
 *  1. Open Google Sheets → Extensions → Apps Script
 *  2. Paste this entire file into the Code.gs editor
 *  3. File → Save (name it "RelaxPro Lead Capture")
 *  4. Deploy → New Deployment → Web App
 *       • Execute as:  Me (your-email@gmail.com)
 *       • Who has access:  Anyone
 *  5. Click "Deploy" — COPY THE WEB APP URL
 *  6. Paste the URL into your .env.local file:
 *       VITE_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/...
 *
 * ─── SHEET SETUP (Auto-created on first submission) ──────
 *
 *  The script will auto-create a sheet named "Leads" with
 *  the following columns if it doesn't already exist:
 *
 *   A: Timestamp        — Auto-filled submission time
 *   B: Order ID         — Unique order reference (checkout only)
 *   C: Full Name        — Customer name
 *   D: Phone            — 10-digit mobile number
 *   E: Email            — Email address
 *   F: City             — Customer city / showroom location
 *   G: Address          — Delivery address (checkout only)
 *   H: Pincode          — 6-digit postal code (checkout only)
 *   I: Contact Time     — Preferred time to call back
 *   J: Product          — Product name / consultation type
 *   K: Size             — Mattress size selected
 *   L: Price            — Order amount
 *   M: Notes            — Custom notes / back pain level
 *   N: Source           — Form type (see table above)
 *
 * ═══════════════════════════════════════════════════════════════
 */

// ─── CONFIGURATION ──────────────────────────────────────────
const SHEET_NAME  = 'Leads';       // Sheet tab name in Google Sheets
const COLUMN_HEADERS = [
  'Timestamp',
  'Order ID',
  'Full Name',
  'Phone',
  'Email',
  'City',
  'Address',
  'Pincode',
  'Contact Time',
  'Product / Service',
  'Size',
  'Price',
  'Notes / Details',
  'Source',
];

// ─── MAIN ENTRY POINT (POST) ───────────────────────────────
function doPost(e) {
  try {
    // 1. Get or create the 'Leads' sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      // Auto-create the sheet with headers on first submission
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(COLUMN_HEADERS);
      // Format header row — bold
      sheet.getRange(1, 1, 1, COLUMN_HEADERS.length)
        .setFontWeight('bold')
        .setBackground('#C9A87C')  // RelaxPro accent gold
        .setFontColor('#0F1F17');  // dark text
    }

    // 2. Extract parameters from the POST request
    //    (sent as URL-encoded form data from leadService.ts)
    const params = e.parameter || {};

    // 3. Build the row — matching the COLUMN_HEADERS order
    const row = [
      new Date(),                          // A: Timestamp
      params.orderId    || '',             // B: Order ID
      params.name       || '',             // C: Full Name
      params.phone      || '',             // D: Phone
      params.email      || '',             // E: Email
      params.city       || '',             // F: City
      params.address    || '',             // G: Address
      params.pincode    || '',             // H: Pincode
      params.contactTime|| '',             // I: Contact Time
      params.product    || '',             // J: Product / Service
      params.size       || '',             // K: Size
      params.price      || '',             // L: Price
      params.notes      || '',             // M: Notes / Details
      params.source     || 'Website',      // N: Source (form type)
    ];

    // 4. Append the row to the sheet
    sheet.appendRow(row);

    // 5. Return success response
    return respond({ success: true, message: 'Lead saved successfully' });

  } catch (err) {
    // Log the error for debugging
    console.error('doPost error:', err.toString());

    // Return error response
    return respond({ success: false, error: err.toString() });
  }
}

// ─── TEST ENDPOINT (GET) ───────────────────────────────────
// Visit the Web App URL in your browser to verify it's live.
// It will show the last row in the sheet for quick verification.
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return respond({ status: 'active', message: 'Sheet not yet created. Waiting for first submission.' });
    }

    const lastRow = sheet.getLastRow();
    const lastData = lastRow > 1 ? sheet.getRange(lastRow, 1, 1, COLUMN_HEADERS.length).getValues()[0] : null;

    return respond({
      status: 'active',
      sheetName: SHEET_NAME,
      totalLeads: lastRow - 1,  // Subtract header row
      lastEntry: lastData ? {
        timestamp: lastData[0],
        name: lastData[2],
        phone: lastData[3],
        source: lastData[13],
      } : null,
      columns: COLUMN_HEADERS,
    });
  } catch (err) {
    return respond({ status: 'error', error: err.toString() });
  }
}

// ─── HELPER: Return JSON response ──────────────────────────
function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── HELPER: Manually add column formatting (optional) ─────
function formatSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return;

  const lastCol = sheet.getLastColumn();
  const headerRange = sheet.getRange(1, 1, 1, lastCol);

  headerRange.setFontWeight('bold');
  headerRange.setBackground('#C9A87C');
  headerRange.setFontColor('#0F1F17');

  // Auto-resize columns for readability
  for (let i = 1; i <= lastCol; i++) {
    sheet.autoResizeColumn(i);
  }
}
