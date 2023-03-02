import abc
from typing import Self, Any


class Entity(abc.ABC):

    fields = ()

    @abc.abstractclassmethod
    def new(cls, **kwargs) -> Self:
        pass

    @abc.abstractclassmethod
    def get(cls, id: int) -> Self:
        pass

    @abc.abstractmethod
    def toJSON(self) -> dict[str, Any]:
        pass

    @abc.abstractmethod
    def check(self) -> None:
        pass

