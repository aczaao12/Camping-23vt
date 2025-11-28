// Thay đổi ID Spreadsheet này bằng ID của Sheet bạn đang dùng
const SPREADSHEET_ID = '1MAEfvRFfiAHtNCTkaDDopsR9hbVDVwApRyUeTqyhkQQ'; 

// Danh sách tên sheet hợp lệ
const VALID_SHEETS = ['Trại phí', 'Ăn uống', 'Mua sắm'];

function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

function handleRequest(e, method) {
  try {
    const sheetName = e.parameter.sheet;

    if (!sheetName || !VALID_SHEETS.includes(sheetName)) {
      return createJsonResponse({
        status: 'error',
        message: `Lỗi: Thiếu tham số "sheet" hoặc tên sheet không hợp lệ. (${VALID_SHEETS.join(', ')})`
      }, 400);
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      return createJsonResponse({ status: 'error', message: `Lỗi: Không tìm thấy sheet "${sheetName}"` }, 404);
    }

    if (method === 'POST') {
      return handlePost(e, sheet, sheetName);
    } else if (method === 'GET') {
      return handleGet(e, sheet, sheetName);
    }

  } catch (error) {
    return createJsonResponse({ status: 'error', message: 'Lỗi máy chủ.', detail: error.toString() }, 500);
  }
}

function handlePost(e, sheet, sheetName) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (error) {
    return createJsonResponse({ status: 'error', message: 'JSON không hợp lệ.' }, 400);
  }

  const action = e.parameter.action || 'add'; // 'add', 'edit', 'delete'
  const rowIndex = parseInt(e.parameter.rowIndex); // Chỉ dùng cho edit/delete

  // --- XỬ LÝ XÓA ---
  if (action === 'delete') {
    if (!rowIndex || rowIndex < 2) {
      return createJsonResponse({ status: 'error', message: 'rowIndex không hợp lệ để xóa.' }, 400);
    }
    sheet.deleteRow(rowIndex);
    return createJsonResponse({ status: 'success', message: 'Đã xóa thành công!' });
  }

  // --- CHUẨN BỊ DỮ LIỆU ---
  let rowData = [];
  if (sheetName === 'Mua sắm') {
    if (!data['Tên vật phẩm'] || !data['Số lượng'] || !data['Giá tiền']) {
      return createJsonResponse({ status: 'error', message: 'Thiếu dữ liệu bắt buộc.' }, 400);
    }
    rowData = [data['Tên vật phẩm'], data['Số lượng'], data['Giá tiền'], data['Ghi chú'] || ''];
  } else {
    if (!data['Họ và tên'] || !data['MSSV'] || !data['Số tiền']) {
      return createJsonResponse({ status: 'error', message: 'Thiếu dữ liệu bắt buộc.' }, 400);
    }
    rowData = [data['Họ và tên'], data['MSSV'], data['Số tiền'], data['Ghi chú'] || ''];
  }

  // --- XỬ LÝ SỬA ---
  if (action === 'edit') {
    if (!rowIndex || rowIndex < 2) {
      return createJsonResponse({ status: 'error', message: 'rowIndex không hợp lệ để sửa.' }, 400);
    }
    // Ghi đè dữ liệu vào hàng cũ
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    return createJsonResponse({ status: 'success', message: 'Đã cập nhật thành công!' });
  }

  // --- XỬ LÝ THÊM MỚI (Mặc định) ---
  sheet.appendRow(rowData);
  return createJsonResponse({ status: 'success', message: 'Đã thêm mới thành công!' }, 201);
}

function handleGet(e, sheet, sheetName) {
  const range = sheet.getDataRange();
  const values = range.getValues();

  if (values.length <= 1) {
    return createJsonResponse({ status: 'success', data: [] }, 200);
  }

  const headers = values[0];
  const data = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const record = {};
    // Thêm rowIndex để FE biết vị trí hàng (i + 1 vì mảng bắt đầu từ 0, sheet bắt đầu từ 1)
    record['_rowIndex'] = i + 1; 
    
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = row[j];
    }
    data.push(record);
  }

  return createJsonResponse({ status: 'success', data: data }, 200);
}

function createJsonResponse(object, status = 200) {
  return ContentService.createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}
