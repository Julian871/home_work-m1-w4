import {query} from "express-validator";



export const blogsQueryValidation = [
    query('searchNameTerm').default(null),
    query('sortBy').default('createdAt'),
    query('sortDirection').default('desc'),
    query('pageNumber').default(1),
    query('pageSize').default(10)
]