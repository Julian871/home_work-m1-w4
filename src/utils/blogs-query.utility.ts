import {DEFAULT_SEARCH_NAME_TERM, DEFAULT_SORT_BY, DEFAULT_SORT_DIRECTION} from "./default-param";

export const getSortBlogsQuery = (searchNameTerm: string | null, sortBy: string | undefined, sortDirection: string | undefined): {searchNameTerm: string | null, sortBy: string, sortDirection: string} =>{
    return {
        searchNameTerm: searchNameTerm || DEFAULT_SEARCH_NAME_TERM,
        sortBy: sortBy || DEFAULT_SORT_BY,
        sortDirection: sortDirection || DEFAULT_SORT_DIRECTION
    }
}