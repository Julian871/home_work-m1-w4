export type headTypes = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: any
}

export class PageInfo {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: any

    constructor(page: number, pageSize: number, totalCount: number, items: any) {
        this.pagesCount = Math.ceil(totalCount / pageSize)
        this.page = page
        this.pageSize = pageSize
        this.totalCount = totalCount
        this.items = items
    }
}