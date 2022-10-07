from typing import Iterable, TypeVar, overload

T = TypeVar("T")


class MyList(list[T]):
    @overload
    def __init__(self) -> None:
        ...

    @overload
    def __init__(self, i: Iterable[T]) -> None:
        ...

    def __init__(self, i: Iterable[T] = None):
        if i:
            super().__init__(i)
        else:
            super().__init__()
