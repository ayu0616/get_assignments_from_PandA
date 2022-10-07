/**授業の課題、テスト・クイズのURLを集めたリストを取得する
 * PandAのホーム画面でChromeのコンソールに以下のプログラムを貼り付ける
 * 出力されたデータをclass_data.jsonに貼り付ける
 */

const zen2han = (str: string) => {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
};

const favorites = document.querySelector("ul#organizeFavoritesList");
if (!favorites) {
    throw new Error("ul#organizeFavoritesList が見つかりません");
}
const classes = [...favorites.querySelectorAll("li.fav-sites-entry")];

const data: { id: string; title: string; assignment_url: string | null; testquiz_url: string | null }[] = [];
for (let li of classes) {
    const id = <string>li.querySelector("a")?.getAttribute("data-site-id");
    let title = <string>li.querySelector("div > a > span.fullTitle")?.innerHTML;
    title = title.replace(/202[2-4][前後]期/, "");
    title = zen2han(title);

    fetch(`https://panda.ecs.kyoto-u.ac.jp/direct/site/${id}/pages.json`)
        .then((res) => res.json())
        .then((pages: { tools: { toolId: string }[]; url: string }[]) => {
            const asmPage = pages.find((x) => x.tools[0].toolId === "sakai.assignment.grades");
            let asmUrl: string | null;
            if (asmPage) {
                asmUrl = asmPage.url;
            } else {
                asmUrl = null;
            }
            const testquizPage = pages.find((x) => x.tools[0].toolId === "sakai.samigo");
            let testquizUrl: string | null;
            if (testquizPage) {
                testquizUrl = testquizPage.url;
            } else {
                testquizUrl = null;
            }

            data.push({ id: id, title: title, assignment_url: asmUrl, testquiz_url: testquizUrl });
        });
}

console.log(JSON.stringify(data));
