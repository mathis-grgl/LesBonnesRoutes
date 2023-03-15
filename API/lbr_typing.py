from typing import TypeAlias, Union

json_values: TypeAlias = Union[str, int, bool, None, "json_list", "json_dict"]
json_dict: TypeAlias = dict[str, json_values]
json_list: TypeAlias = list[json_values]

json_like: TypeAlias = json_dict | json_list
