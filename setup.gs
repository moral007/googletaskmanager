
// ==============================
// 📁 setup.gs – Sheet Initializer
// ==============================

function setupDemoSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const today = new Date();

  // 🔹 Login Sheet
  let loginSheet = ss.getSheetByName('Login') || ss.insertSheet('Login');
  loginSheet.clear();
  loginSheet.appendRow(['Email', 'Password', 'Role', 'LastLogin']);
  loginSheet.appendRow(['admin@example.com', 'admin123', 'admin', '']);
  loginSheet.appendRow(['user1@example.com', 'user123', 'user', '']);

  // 🔹 Task Sheet
  let taskSheet = ss.getSheetByName('TASK') || ss.insertSheet('TASK');
  taskSheet.clear();
  taskSheet.appendRow(['Username', 'Task', 'StartDate', 'EndDate', 'Duration', 'CreatedTime', 'Priority']);
  taskSheet.appendRow(['user1@example.com', 'Prepare Report', today, '', '', today, 'Yes']);
  taskSheet.appendRow(['user1@example.com', 'Team Meeting', today, today, '0 days', today, 'No']);

  // 🔹 Milestones Sheet
  let milestoneSheet = ss.getSheetByName('MILESTONES') || ss.insertSheet('MILESTONES');
  milestoneSheet.clear();
  milestoneSheet.appendRow(['TaskRow', 'TaskName', 'MilestoneName', 'TargetDate', 'Status', 'CompletionDate']);
  milestoneSheet.appendRow([2, 'Prepare Report', 'Draft Outline', today, 'Pending', '']);
  milestoneSheet.appendRow([2, 'Prepare Report', 'Finalize Design', today, 'Completed', today]);

  // 🔹 Task Messages Sheet
  let messageSheet = ss.getSheetByName('TASK_MESSAGES') || ss.insertSheet('TASK_MESSAGES');
  messageSheet.clear();
  messageSheet.appendRow(['TaskRow', 'TaskName', 'Author', 'Message', 'Timestamp']);
  messageSheet.appendRow([2, 'Prepare Report', 'user1@example.com', 'Started working on the draft.', today]);
  messageSheet.appendRow([2, 'Prepare Report', 'admin@example.com', 'Please share by Friday.', today]);

  SpreadsheetApp.flush();
}
