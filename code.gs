// Setup Sheets Initially
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetNames = ['Users', 'Tasks', 'Milestones', 'Messages'];
  const headers = {
    'Users': ['Email', 'Password', 'Role'],
    'Tasks': ['Username', 'Task', 'Start Date', 'End Date', 'Priority'],
    'Milestones': ['Task Row', 'Milestone'],
    'Messages': ['Task Row', 'Message', 'Author', 'Timestamp']
  };

  sheetNames.forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      sheet.appendRow(headers[name]);
    }
  });

  // Add sample users if none exist
  const userSheet = ss.getSheetByName('Users');
  const userData = userSheet.getDataRange().getValues();
  if (userData.length <= 1) {
    userSheet.appendRow(['admin@example.com', 'admin123', 'admin']);
    userSheet.appendRow(['user1@example.com', 'user123', 'user']);
  }
}

// Serve HTML Web App
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Employee Task Management System')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Validate Login (with password)
function validateLogin(email, password) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email && data[i][1] === password) {
      return { status: "success", role: data[i][2] };
    }
  }
  return { status: "error", message: "Invalid email or password" };
}

// Save New Task
function saveNewTask(taskData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks');
  sheet.appendRow([
    taskData.username,
    taskData.task,
    taskData.startDate,
    taskData.endDate,
    taskData.priority
  ]);
}

// Update Task
function updateExistingTask(taskDetails) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (
      data[i][0] === taskDetails.username &&
      data[i][1] === taskDetails.task &&
      data[i][2] === taskDetails.startDate
    ) {
      sheet.getRange(i + 1, 2).setValue(taskDetails.task);
      sheet.getRange(i + 1, 3).setValue(taskDetails.startDate);
      sheet.getRange(i + 1, 4).setValue(taskDetails.endDate);
      sheet.getRange(i + 1, 5).setValue(taskDetails.priority);
      break;
    }
  }
}

// Mark Task Complete
function markTaskComplete(taskDetails) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (
      data[i][0] === taskDetails.username &&
      data[i][1] === taskDetails.task &&
      data[i][2] === taskDetails.startDate
    ) {
      sheet.getRange(i + 1, 4).setValue(new Date());
      break;
    }
  }
}

// Save End Time (manual)
function saveEndTime(taskDetails, endDate) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (
      data[i][0] === taskDetails.username &&
      data[i][1] === taskDetails.task &&
      data[i][2] === taskDetails.startDate
    ) {
      sheet.getRange(i + 1, 4).setValue(endDate);
      break;
    }
  }
}

// Get Completed Tasks
function getCompletedTasks(username) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks');
  return sheet.getDataRange().getValues()
    .filter((row, index) => index !== 0 && row[0] === username && row[3])
    .map((row, i) => ({
      username: row[0],
      task: row[1],
      startDate: row[2],
      endDate: row[3],
      duration: getTaskDuration(row[2], row[3]),
      priority: row[4]
    }));
}

// Get Incomplete Tasks
function getIncompleteTasks(username) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks');
  return sheet.getDataRange().getValues()
    .filter((row, index) => index !== 0 && row[0] === username && !row[3])
    .map(row => ({
      username: row[0],
      task: row[1],
      startDate: row[2],
      endDate: row[3],
      priority: row[4]
    }));
}

// Get All Tasks (Admin)
function getAllTasks() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks');
  return sheet.getDataRange().getValues().slice(1);
}

// Get Task Duration
function getTaskDuration(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.floor((e - s) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff + ' days' : 'Invalid';
}

// ==================== ✅ NEW FUNCTIONS ==================== //

// Add Milestone to Task
function addMilestone(taskRow, milestoneText) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Milestones');
  sheet.appendRow([taskRow, milestoneText]);
}

// Get Milestones for Task
function getTaskMilestones(taskRow) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Milestones');
  return sheet.getDataRange().getValues()
    .filter((row, i) => i !== 0 && row[0] == taskRow)
    .map(row => row[1]);
}

// Add Message to Task
function addTaskMessage(taskRow, message, author) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Messages');
  sheet.appendRow([taskRow, message, author, new Date()]);
}

// Get Messages for Task
function getTaskMessages(taskRow) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Messages');
  return sheet.getDataRange().getValues()
    .filter((row, i) => i !== 0 && row[0] == taskRow)
    .map(row => ({
      message: row[1],
      author: row[2],
      time: row[3]
    }));
}
