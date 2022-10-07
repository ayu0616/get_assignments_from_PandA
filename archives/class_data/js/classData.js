"use strict";
/**授業の課題、テスト・クイズのURLを集めたリストを取得する
 * PandAのホーム画面でChromeのコンソールに以下のプログラムを貼り付ける
 * 出力されたデータをclass_data.jsonに貼り付ける
 */
const zen2han = (str) => {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
};
const favorites = document.querySelector("ul#organizeFavoritesList");
if (!favorites) {
    throw new Error("ul#organizeFavoritesList が見つかりません");
}
const classes = [...favorites.querySelectorAll("li.fav-sites-entry")];
const data = [];
for (let li of classes) {
    const id = li.querySelector("a")?.getAttribute("data-site-id");
    let title = li.querySelector("div > a > span.fullTitle")?.innerHTML;
    title = title.replace(/202[2-4][前後]期/, "");
    title = zen2han(title);
    fetch(`https://panda.ecs.kyoto-u.ac.jp/direct/site/${id}/pages.json`)
        .then((res) => res.json())
        .then((pages) => {
        const asmPage = pages.find((x) => x.tools[0].toolId === "sakai.assignment.grades");
        let asmUrl;
        if (asmPage) {
            asmUrl = asmPage.url;
        }
        else {
            asmUrl = null;
        }
        const testquizPage = pages.find((x) => x.tools[0].toolId === "sakai.samigo");
        let testquizUrl;
        if (testquizPage) {
            testquizUrl = testquizPage.url;
        }
        else {
            testquizUrl = null;
        }
        data.push({ id: id, title: title, assignment_url: asmUrl, testquiz_url: testquizUrl });
    });
}
console.log(JSON.stringify(data));
