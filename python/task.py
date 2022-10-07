from typing import TypedDict


class Task(TypedDict):
    title: str
    panda_id: str
    due_date: str
    description: str
    last_fixed_date: str
