import {DEFAULT_SEARCH_NAME_TERM, DEFAULT_SORT_BY, DEFAULT_SORT_DIRECTION} from "./default-param";

export const getSortPostsQuery = (sortBy: string | undefined, sortDirection: string | undefined): {sortBy: string, sortDirection: 1 | -1} =>{
    return {
        sortBy: sortBy || DEFAULT_SORT_BY,
        sortDirection: sortDirection === 'asc' ? 1 : DEFAULT_SORT_DIRECTION
    }
}