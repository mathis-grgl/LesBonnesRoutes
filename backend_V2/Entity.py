from __future__ import annotations
import abc
from typing import Self, Any


class Entity(abc.ABC):

    fields = ()

    @abc.abstractclassmethod
    def new(cls, **kwargs) -> Entity:
        pass

    @abc.abstractclassmethod
    def get(cls, id: int) -> Entity:
        pass

    @abc.abstractmethod
    def toJSON(self, *, partial: bool=False) -> dict[str, Any]:
        pass

    @abc.abstractmethod
    def check(self) -> None:
        pass

