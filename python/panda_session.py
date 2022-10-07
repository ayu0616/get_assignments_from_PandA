import requests
from bs4 import BeautifulSoup

from python.query_classes_data import QueryClassesDataType
from python.settings import NOW_SEMESTER
from python.task import Task
from python.util.zenhantrans import zen2han


class PandaSession(requests.Session):
    def __init__(self, user_name: str, password: str) -> None:
        super().__init__()
        self.user_name = user_name
        self.password = password

    def create_soup(self, url: str):
        "urlからsoupを作る"
        res = self.get(url)
        soup = BeautifulSoup(res.text, "html.parser")
        return soup

    def __get_lt(self, url: str):
        # ltを取得する
        soup = self.create_soup(url)
        lt = soup.find(attrs={"name": "lt"}).get("value")
        return lt

    def login(self):
        # PandAにログインする
        login_url = "https://panda.ecs.kyoto-u.ac.jp/cas/login?service=https%3A%2F%2Fpanda.ecs.kyoto-u.ac.jp%2Fsakai-login-tool%2Fcontainer"
        login_data = {
            "username": self.user_name,
            "password": self.password,
            "warn": "true",
            "lt": self.__get_lt(login_url),
            "execution": "e1s1",
            "_eventId": "submit",
        }
        res = self.post(login_url, data=login_data)
        if res.ok:
            self.is_login = True

    def query_classes(self):
        if not self.is_login:
            raise Exception("ログインを完了してからこの操作を行なってください")

        site_json: list[dict[str, str | int | None | list | dict]] = self.get(
            "https://panda.ecs.kyoto-u.ac.jp/direct/site.json?_limit=200"
        ).json()["site_collection"]

        query_data: list[QueryClassesDataType] = []
        for site in site_json:
            id: str = site["entityId"]
            title: str = site["entityTitle"]

            if title.startswith("[") and not title.startswith(f"[{NOW_SEMESTER}"):
                continue

            title = title.replace(NOW_SEMESTER, "")
            title = zen2han(title[:4]) + title[4:]

            # KULASISの授業名と異なるものや、時間割がついていないものを編集
            match title:
                case "[月2]中国語IIＢ":
                    title = "[月2]中国語IIＢ [文法・文化理解]"
                case "[月5]中国語IIＢ":
                    title = "[月5]中国語IIＢ [会話・ネイティブ実習]"
                case "経済学部秋田ゼミ":
                    title = "[水3]経済学部秋田ゼミ"

            if not title.startswith("["):
                continue

            d = {"id": id, "title": title}
            query_data.append(d)

        return query_data

    def get_assignments(self, data: QueryClassesDataType) -> list[Task]:
        url = data["assignment_url"]
        if not url:
            return []

        tasks: list[Task] = []
        return tasks
