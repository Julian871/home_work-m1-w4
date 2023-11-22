import {
    DEFAULT_SEARCH_EMAIL_TERM,
    DEFAULT_SEARCH_LOGIN_TERM,
    DEFAULT_SORT_BY,
    DEFAULT_SORT_DIRECTION
} from "./default-param";

export const getSortUsersQuery = (sortBy: string | undefined, sortDirection: string | undefined, searchLoginTerm: string | null, searchEmailTerm: string | null): {
    sortBy: string,
    sortDirection: 1 | -1,
    searchLoginTerm: string | null,
    searchEmailTerm: string | null
} => {
    return {
        sortBy: sortBy || DEFAULT_SORT_BY,
        sortDirection: sortDirection === 'asc' ? 1 : DEFAULT_SORT_DIRECTION,
        searchEmailTerm: searchEmailTerm || DEFAULT_SEARCH_EMAIL_TERM,
        searchLoginTerm: searchLoginTerm || DEFAULT_SEARCH_LOGIN_TERM
    }
}