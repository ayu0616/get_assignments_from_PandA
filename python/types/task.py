from typing import TypedDict


class Task(TypedDict):
    title: str
    class_name: str
    panda_id: str
    due_date: str
    url: str
    last_fixed_date: str  # 最終更新日時（自分側の）
