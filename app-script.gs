const SPREADSHEET_ID = "1NrFy4MSMIxoiNzBWP5isP2uaCuhrTMnpnSbSqwKHB5E";
const COMMENTS_SHEET = "comments";
const SHOPPING_SHEET = "shopping-list";

// 小工具：取得指定工作表
function getSheet(sheetName) {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    return ss.getSheetByName(sheetName);
}

function doPost(e) {
    var data = {};
    try {
        data = JSON.parse(e.postData.contents);
    } catch (err) {
        return ContentService.createTextOutput(
            JSON.stringify({ status: "error", message: "invalid json" })
        ).setMimeType(ContentService.MimeType.JSON);
    }

    var type = data.type || "comment"; // 不傳 type 就當作留言

    // ==============================
    // 1) 購物清單 shopping-list
    // ==============================
    if (type === "shopping") {
        var sheet = getSheet(SHOPPING_SHEET);
        if (!sheet) {
            return ContentService.createTextOutput(
                JSON.stringify({ status: "error", message: "shopping sheet not found" })
            ).setMimeType(ContentService.MimeType.JSON);
        }

        // 切換勾選狀態（checked 0/1）
        if (data.action === "toggle" && data.timestamp) {
            var values = sheet.getDataRange().getValues();
            for (var i = values.length - 1; i >= 1; i--) {
                // 從最後一列往上找
                var rowTimestamp = values[i][0]; // A 欄 timestamp
                if (rowTimestamp && rowTimestamp.getTime && rowTimestamp.getTime().toString() === data.timestamp) {
                    var current = values[i][3]; // D 欄 checked
                    var next = current === 1 || current === true ? 0 : 1;
                    sheet.getRange(i + 1, 4).setValue(next); // 第 i+1 列，第 4 欄（D）
                    return ContentService.createTextOutput(
                        JSON.stringify({ status: "ok", message: "toggled", checked: next })
                    ).setMimeType(ContentService.MimeType.JSON);
                }
            }
            return ContentService.createTextOutput(JSON.stringify({ status: "not_found" })).setMimeType(
                ContentService.MimeType.JSON
            );
        }

        // 如果需要刪除購物項目
        if (data.action === "delete" && data.timestamp) {
            var valuesDel = sheet.getDataRange().getValues();
            for (var j = valuesDel.length - 1; j >= 1; j--) {
                var ts = valuesDel[j][0];
                if (ts && ts.getTime && ts.getTime().toString() === data.timestamp) {
                    sheet.deleteRow(j + 1);
                    return ContentService.createTextOutput(
                        JSON.stringify({ status: "ok", message: "deleted" })
                    ).setMimeType(ContentService.MimeType.JSON);
                }
            }
            return ContentService.createTextOutput(JSON.stringify({ status: "not_found" })).setMimeType(
                ContentService.MimeType.JSON
            );
        }

        // 新增購物清單項目（item 必填）
        if (data.item && data.item.toString().trim()) {
            sheet.appendRow([
                new Date(), // timestamp (A)
                data.item.toString().trim(), // item (B)
                data.quantity || "", // quantity (C)
                0, // checked (D) 預設 0（未勾）
                data.tripId || "", // tripId (E)
            ]);
            return ContentService.createTextOutput(
                JSON.stringify({ status: "ok", message: "shopping_appended" })
            ).setMimeType(ContentService.MimeType.JSON);
        }

        return ContentService.createTextOutput(
            JSON.stringify({ status: "error", message: "no shopping content" })
        ).setMimeType(ContentService.MimeType.JSON);
    }

    // ==============================
    // 2) 留言 comments（你原本的邏輯）
    // ==============================
    var sheet = getSheet(COMMENTS_SHEET);
    if (!sheet) {
        return ContentService.createTextOutput(
            JSON.stringify({ status: "error", message: "comments sheet not found" })
        ).setMimeType(ContentService.MimeType.JSON);
    }

    // 處理刪除留言
    if (data.action === "delete") {
        var values = sheet.getDataRange().getValues();
        for (var i = values.length - 1; i >= 1; i--) {
            var rowTimestamp = values[i][0];
            if (rowTimestamp && rowTimestamp.getTime && rowTimestamp.getTime().toString() === data.timestamp) {
                sheet.deleteRow(i + 1);
                return ContentService.createTextOutput(
                    JSON.stringify({ status: "ok", message: "deleted" })
                ).setMimeType(ContentService.MimeType.JSON);
            }
        }
        return ContentService.createTextOutput(JSON.stringify({ status: "not_found" })).setMimeType(
            ContentService.MimeType.JSON
        );
    }

    // 處理新增留言（note 必填）
    if (data.note && data.note.trim()) {
        sheet.appendRow([new Date(), data.name || "", data.note.trim(), data.tripId || ""]);
        return ContentService.createTextOutput(JSON.stringify({ status: "ok", message: "appended" })).setMimeType(
            ContentService.MimeType.JSON
        );
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "no content" })).setMimeType(
        ContentService.MimeType.JSON
    );
}

function doGet(e) {
    var type = (e && e.parameter && e.parameter.type) || "comment";

    // 讀取購物清單
    if (type === "shopping") {
        var sheet = getSheet(SHOPPING_SHEET);
        if (!sheet) {
            return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
        }

        var values = sheet.getDataRange().getValues();
        var rows = [];
        for (var i = 1; i < values.length; i++) {
            // 跳過標題列
            var row = values[i];
            if (row[1] && row[1].toString().trim()) {
                // item 有內容才算
                rows.push({
                    timestamp: row[0] && row[0].getTime ? row[0].getTime() : null,
                    item: row[1] || "",
                    quantity: row[2] || "",
                    checked: row[3] === 1 || row[3] === true,
                    tripId: row[4] || "",
                });
            }
        }

        return ContentService.createTextOutput(JSON.stringify(rows)).setMimeType(ContentService.MimeType.JSON);
    }

    // 讀取留言（comments）
    var sheet = getSheet(COMMENTS_SHEET);
    if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }

    var values = sheet.getDataRange().getValues();
    var rows = [];
    for (var j = 1; j < values.length; j++) {
        var row = values[j];
        if (row[2] && row[2].toString().trim()) {
            rows.push({
                timestamp: row[0] ? row[0].getTime() : null,
                name: row[1] || "",
                note: row[2] || "",
                tripId: row[3] || "",
            });
        }
    }

    return ContentService.createTextOutput(JSON.stringify(rows)).setMimeType(ContentService.MimeType.JSON);
}
