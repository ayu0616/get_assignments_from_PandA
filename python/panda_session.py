import requests
from bs4 import BeautifulSoup


class PandaSession(requests.Session):
    def __init__(self, user_name: str, password: str) -> None:
        super().__init__()
        self.user_name = user_name
        self.password = password

    def create_soup(self, url):
        "urlからsoupを作る"
        res = self.get(url)
        soup = BeautifulSoup(res.text, "html.parser")
        return soup

    def __get_lt(self, url):
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
        self.post(login_url, data=login_data)
