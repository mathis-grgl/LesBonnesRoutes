from dataclasses import dataclass

from lbr_typing import json_dict
from database_manager import userManager

@dataclass(repr=False, eq=False)
class UserInfo:
    user_id: int
    isAdmin: bool

    @property
    def user(self) -> json_dict:
        return userManager.get_user(id=self.user_id)