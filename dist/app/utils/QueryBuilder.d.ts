type PrismaQueryOptions<T> = {
    where?: T;
    orderBy?: any;
    skip?: number;
    take?: number;
    select?: any;
};
export declare class QueryBuilder<TWhereInput = any> {
    readonly query: Record<string, string>;
    private prismaQuery;
    constructor(query: Record<string, string>);
    filter(): this;
    search(searchableFields: string[]): this;
    sort(): this;
    fields(): this;
    paginate(): this;
    build(): PrismaQueryOptions<TWhereInput>;
    getMeta(total: number): {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
}
export {};
//# sourceMappingURL=QueryBuilder.d.ts.map