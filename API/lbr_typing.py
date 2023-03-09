from typing import TypeAlias, Union

json_dict: TypeAlias = dict[str, Union[str, int, bool, "json_dict"]]