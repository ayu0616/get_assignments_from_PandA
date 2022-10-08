from panda_session import PandaSession
from python.settings import GOOGLE_SPREADSHEET_POST_URL
from python.types.task import Task
from settings import PASSWORD, USER_NAME


def main():
    session = PandaSession(USER_NAME, PASSWORD)
    session.login()  # PandAにログイン

    class_data = session.query_classes()  # 授業のデータを取得

    task_data: list[Task] = []  # 課題、テスト・クイズを格納する配列
    for d in class_data:
        asm = session.get_assignments(d)
        tq = session.get_testquiz(d)
        task_data.extend(asm)
        task_data.extend(tq)

    res = session.get(GOOGLE_SPREADSHEET_POST_URL, headers=task_data)  # スプレッドシートに送信する
    print(res)


if __name__ == "__main__":
    main()
