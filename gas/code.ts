// 定数設定
const SHEET_ID = "1e12Qak103dxHgXPP0oG_oWZAEyqAUrIEO5zCvDNWBv8";

// 型設定
type PostParameter = {
    type: "add";
    panda_data: string;
};

type PandaData = {
    title: string;
    class_name: string;
    due_date: string;
    panda_id: string;
    url: string;
    last_fixed_date: string;
};

type Data = PandaData & {};

// 関数設定
const getValueData = (allRange: GoogleAppsScript.Spreadsheet.Range) => {
    const values = allRange.getValues().map((row) =>
        row.map((cell) => {
            switch (typeof cell) {
                case "number":
                    return cell.toString();
                default:
                    return cell;
            }
        })
    ) as string[][];
    const headers = values[0] as (keyof Data)[];
    if (values.length >= 2) {
        const contents = values.slice(1);
        const data = contents.map((row) => {
            const d = {} as Data;
            row.forEach((item, i) => {
                d[headers[i]] = item;
            });
            return d;
        });
        return data;
    } else {
        const d = {} as Data;
        headers.forEach((header) => {
            d[header] = "";
        });
        return [d];
    }
};

const postResponse = () => {
    const res = ContentService.createTextOutput();
    // Mime TypeをJSONに設定
    res.setMimeType(ContentService.MimeType.JSON);
    const body = {
        code: 200,
        text: "ok",
    };
    // JSONテキストをセットする
    res.setContent(JSON.stringify(body));

    return res;
};

const add = (pandaDataList: PandaData[]) => {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheetName = "tasks";
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
        throw new Error(`"${sheetName}" という名前のシートは存在しません`);
    }

    const dataRange = sheet.getDataRange();
    const valueData = getValueData(dataRange);
    const headers = Object.keys(valueData[0]) as (keyof Data)[];

    const addValues: string[][] = [];
    pandaDataList.forEach((pandaData) => {
        // 追加データが既存データと重複していないか確認する
        const pandaIds = valueData.map((d) => d["panda_id"]);
        const pandaIdIndex = pandaIds.indexOf(pandaData["panda_id"]); //panda_idのインデックス（新規データなら-1になる）

        if (pandaIdIndex === -1) {
            const addRow: string[] = new Array(headers.length).fill("");
            (Object.keys(pandaData) as (keyof PandaData)[]).forEach((key) => (addRow[headers.indexOf(key)] = pandaData[key]));
            addValues.push(addRow);
        } else {
            //TODO: 既存のデータを更新するプログラムを書く
        }
    });

    sheet.getRange(sheet.getLastRow() + 1, 1, addValues.length, headers.length).setValues(addValues);
};

const doPost = (e: GoogleAppsScript.Events.DoPost) => {
    const param = e.parameter as PostParameter;
    switch (param.type) {
        case "add":
            add(JSON.parse(param.panda_data));
    }

    return postResponse();
};

const doGet = () => {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheetName = "tasks";
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
        throw new Error(`"${sheetName}" という名前のシートは存在しません`);
    }

    const dataRange = sheet.getDataRange();
    const valueData = getValueData(dataRange);
    return JSON.stringify(valueData)
}