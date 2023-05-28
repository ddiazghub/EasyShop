
from typing import TypeVar, Callable, Iterable

T = TypeVar("T")
K = TypeVar("K")
E = TypeVar("E")
def group_by(elements: Iterable[T], key: Callable[[T], K] = lambda element: element, transform: Callable[[T], E] = lambda element: element) -> dict[K, list[E]]:
    groups: dict[K, list[T]] = dict()

    for element in elements:
        element_id = key(element)
        group = groups.get(element_id, [])
        
        if len(group) == 0:
            groups[element_id] = group
        
        group.append(transform(element))

    return groups