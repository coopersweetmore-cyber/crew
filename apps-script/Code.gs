/**
 * Sign-up receiver for the website forms.
 *
 * Paste this into the Apps Script editor of your Google Sheet
 * (Extensions > Apps Script) and deploy it as a web app. See README.md.
 *
 * Each form POST adds one row to the "Families", "Workers" or "Businesses" tab,
 * with a timestamp in the first column. Tabs and header rows are
 * created automatically the first time a sign-up arrives.
 */

/**
 * @OnlyCurrentDoc
 * Limits this script to the one Sheet it belongs to, so Google only asks
 * for access to that Sheet instead of all your spreadsheets.
 */

var TABS = {
  family: {
    name: 'Families',
    fields: ['name', 'email', 'phone', 'parish', 'jobs', 'frequency', 'booking_fee', 'fair_rate', 'payment', 'consent'],
    headers: ['Timestamp', 'Name', 'Email', 'Phone', 'Parish', 'Jobs they would book', 'How often',
              'Would pay 15% fee', 'Fair hourly rate', 'Preferred payment', 'Consent']
  },
  business: {
    name: 'Businesses',
    fields: ['business_name', 'business_type', 'name', 'email', 'phone', 'interests', 'young_people_per_year', 'consent'],
    headers: ['Timestamp', 'Business', 'Type', 'Contact name', 'Email', 'Phone', 'Interested in',
              'Young people a year', 'Consent']
  },
  worker: {
    name: 'Workers',
    fields: ['name', 'email', 'age_band', 'parent_email', 'school', 'parish', 'jobs', 'hours_per_week', 'pt_bank_account', 'consent'],
    headers: ['Timestamp', 'Name', 'Email', 'Age band', 'Parent or guardian email', 'School or university', 'Parish',
              'Jobs interested in', 'Hours per week', 'Portuguese bank account', 'Consent']
  }
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var p = (e && e.parameter) || {};
    var tab = TABS[p.form];
    if (!tab) return reply({ ok: false, error: 'Unknown form' });

    // The site never sends under-16 sign-ups, but refuse them here too.
    if (p.form === 'worker' && p.age_band === 'Under 16') {
      return reply({ ok: false, error: 'Under 16' });
    }
    if (!p.email || p.consent !== 'Yes') {
      return reply({ ok: false, error: 'Missing email or consent' });
    }

    var sheet = getTab(tab);
    var row = [new Date()].concat(tab.fields.map(function (f) { return clean(p[f]); }));
    sheet.appendRow(row);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Visiting the web app URL in a browser shows this, so you can check it is live.
function doGet() {
  return ContentService.createTextOutput('Sign-up endpoint is running.');
}

function getTab(tab) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(tab.name);
  if (!sheet) sheet = ss.insertSheet(tab.name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(tab.headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, tab.headers.length).setFontWeight('bold');
  }
  return sheet;
}

// Trim, cap length, and stop text being read as a spreadsheet formula.
function clean(value) {
  var s = String(value == null ? '' : value).trim().slice(0, 500);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
