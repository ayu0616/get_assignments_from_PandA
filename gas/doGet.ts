type PostData = {
    title: string;
    class_name: string;
    due_date: string;
    panda_id: string;
    url: string;
    last_fixed_date: string;
};

const doGet = (e: GoogleAppsScript.Events.DoPost) => {
    const postDataList: PostData[] = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.openById("1e12Qak103dxHgXPP0oG_oWZAEyqAUrIEO5zCvDNWBv8");
    const sheetName = "tasks";
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
        throw new Error(`"${sheetName}" という名前のシートは存在しません`);
    }

    const dataRange = sheet.getDataRange();
    const allValues: string[][] = dataRange.getValues();
    const headers = allValues[0];

    const addValues: string[][] = [];
    postDataList.forEach((postData) => {
        const row = new Array(headers.length).fill("");
        (Object.keys(postData) as (keyof PostData)[]).forEach((key) => (row[headers.indexOf(key)] = postData[key]));
        addValues.push(row);
    });

    const maxRow = sheet.getMaxRows();
    sheet.getRange(2, 1, maxRow - 1, headers.length).setValues(addValues);
};
