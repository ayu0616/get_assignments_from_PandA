from typing import TypedDict


class QueryClassesDataType(TypedDict):
    id: str
    title: str
    assignment_url: str | None
    testquiz_url: str | None
