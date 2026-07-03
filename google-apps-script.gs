/**
 * RelaxPro Premium Mattresses - Lead Capture Script
 * 
 * Deploy as Web App → Execute as: Me → Who has access: Anyone
 * 
 * Sheet headers (Row 1):
 * Timestamp | Order ID | Name | Phone | Email | City | Address | Pincode | Contact Time | Product | Size | Price | Notes | Source
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
    if (!sheet) return ContentService.createTextOutput("Sheet 'Leads' not found");

    sheet.appendRow([
      new Date(),
      e.parameter.orderId || '',
      e.parameter.name || '',
      e.parameter.phone || '',
      e.parameter.email || '',
      e.parameter.city || '',
      e.parameter.address || '',
      e.parameter.pincode || '',
      e.parameter.contactTime || '',
      e.parameter.product || '',
      e.parameter.size || '',
      e.parameter.price || '',
      e.parameter.notes || '',
      e.parameter.source || ''
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
