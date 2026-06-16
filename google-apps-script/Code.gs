/**
 * GearboxTraining — Google Apps Script Web App
 * Deploy as: Execute as Me, Access: Anyone
 *
 * Sheet columns (1-indexed):
 * 1: RefCode | 2: Name | 3: Phone | 4: Location | 5: Experience
 * 6: Reason | 7: CanAttend | 8: Status | 9: ReceiptURL | 10: Timestamp
 *
 * NOTE: POST requests use application/x-www-form-urlencoded.
 * Read params from e.parameter (NOT e.postData.contents).
 */
var DRIVE_FOLDER_ID = "1--0uLijXmrweYmC01C6isPXsVbwHVX3B";
var SHEET_NAME = "Applicants";

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "RefCode", "Name", "Phone", "Location", "Experience",
      "Reason", "CanAttend", "Status", "ReceiptURL", "Timestamp"
    ]);
  }
  return sheet;
}

function generateRefCode(rowCount) {
  var num = String(rowCount).padStart(3, "0");
  return "GBT-" + num;
}

// ============================================================
// doPost — reads from e.parameter (form-urlencoded)
// ============================================================
function doPost(e) {
  try {
    // Works with application/x-www-form-urlencoded bodies
    var params = e.parameter;
    var action = params.action;

    if (action === "submit") {
      return handleSubmit(params);
    } else if (action === "upload") {
      return handleUpload(params);
    } else if (action === "updateStatus") {
      return handleUpdateStatus(params);
    } else if (action === "deleteApplicant") {
      return handleDeleteApplicant(params);
    } else {
      return jsonResponse({ success: false, error: "Unknown action: " + action });
    }
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) });
  }
}

// ============================================================
// doGet — query string params
// ============================================================
function doGet(e) {
  try {
    var action = e.parameter.action;

    if (action === "getAll") {
      return handleGetAll();
    } else {
      return jsonResponse({ success: false, error: "Unknown action: " + action });
    }
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) });
  }
}

// ============================================================
// action=submit — append a new applicant row
// ============================================================
function handleSubmit(params) {
  var sheet = getSheet();
  var lastRow = sheet.getLastRow();
  // lastRow=1 means only header exists → first applicant is GBT-001
  var refCode = generateRefCode(lastRow);

  sheet.appendRow([
    refCode,
    params.name || "",
    params.phone || "",
    params.location || "",
    params.experience || "",
    params.reason || "",
    params.canAttend || "",
    "pending_payment",
    "",
    new Date().toISOString()
  ]);

  return jsonResponse({ success: true, refCode: refCode });
}

// ============================================================
// action=upload — save base64 file to Drive, update ReceiptURL
// ============================================================
function handleUpload(params) {
  var ref       = params.ref;
  var fileBase64 = params.fileBase64;
  var fileName  = params.fileName || ("receipt_" + ref);
  var mimeType  = params.mimeType || "application/octet-stream";

  if (!ref || !fileBase64) {
    return jsonResponse({ success: false, error: "ref and fileBase64 are required." });
  }

  var decoded = Utilities.newBlob(
    Utilities.base64Decode(fileBase64),
    mimeType,
    fileName
  );

  var folder;
  try {
    folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  } catch (e) {
    folder = DriveApp.getRootFolder();
  }

  var file = folder.createFile(decoded);
  file.setName(ref + "_" + fileName);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  var fileUrl = "https://drive.google.com/file/d/" + file.getId() + "/view";

  // Update ReceiptURL (col 9) and Status (col 8)
  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === ref) {
      sheet.getRange(i + 1, 9).setValue(fileUrl);
      sheet.getRange(i + 1, 8).setValue("awaiting_verification");
      break;
    }
  }

  return jsonResponse({ success: true, receiptUrl: fileUrl });
}

// ============================================================
// action=updateStatus — find row by RefCode, update Status
// ============================================================
function handleUpdateStatus(params) {
  var ref       = params.ref;
  var newStatus = params.status;

  if (!ref || !newStatus) {
    return jsonResponse({ success: false, error: "ref and status are required." });
  }

  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();
  var found = false;

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === ref) {
      sheet.getRange(i + 1, 8).setValue(newStatus);
      found = true;
      break;
    }
  }

  if (!found) {
    return jsonResponse({ success: false, error: "RefCode not found: " + ref });
  }

  return jsonResponse({ success: true });
}

// ============================================================
// action=deleteApplicant — find row by RefCode, delete row
// ============================================================
function handleDeleteApplicant(params) {
  var ref = params.ref;

  if (!ref) {
    return jsonResponse({ success: false, error: "ref is required." });
  }

  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();
  var found = false;

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === ref) {
      sheet.deleteRow(i + 1);
      found = true;
      break;
    }
  }

  if (!found) {
    return jsonResponse({ success: false, error: "RefCode not found: " + ref });
  }

  return jsonResponse({ success: true });
}

// ============================================================
// action=getAll — return all rows as JSON
// ============================================================
function handleGetAll() {
  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return jsonResponse({ rows: [] });
  }

  var headers = [
    "refCode", "name", "phone", "location", "experience",
    "reason", "canAttend", "status", "receiptUrl", "timestamp"
  ];

  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      var val = data[i][j];
      row[headers[j]] = val instanceof Date ? val.toISOString() : String(val);
    }
    rows.push(row);
  }

  return jsonResponse({ rows: rows });
}

// ============================================================
// Helper: JSON response
// ============================================================
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
