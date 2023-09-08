import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from "./default-param";

export const getPaginationData = (pageNumber: number | undefined, pageSize: number | undefined): {pageNumber: number, pageSize: number} =>{
    return {
        pageNumber: pageNumber || DEFAULT_PAGE_NUMBER,
        pageSize: pageSize || DEFAULT_PAGE_SIZE,
    }
}