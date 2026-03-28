export class QueryBuilder {
    query;
    prismaQuery = {};
    constructor(query) {
        this.query = query;
    }
    filter() {
        const filter = { ...this.query };
        const excludeFields = ["searchTerm", "sort", "page", "limit", "fields"];
        excludeFields.forEach((field) => delete filter[field]);
        this.prismaQuery.where = {
            ...(this.prismaQuery.where || {}),
            ...filter,
        };
        return this;
    }
    search(searchableFields) {
        const searchTerm = this.query.searchTerm;
        if (searchTerm) {
            this.prismaQuery.where = {
                ...(this.prismaQuery.where || {}),
                OR: searchableFields.map((field) => ({
                    [field]: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                })),
            };
        }
        return this;
    }
    sort() {
        const sort = this.query.sort || "-createdAt";
        if (sort) {
            const field = sort.startsWith("-") ? sort.substring(1) : sort;
            const order = sort.startsWith("-") ? "desc" : "asc";
            this.prismaQuery.orderBy = {
                [field]: order,
            };
        }
        return this;
    }
    fields() {
        if (this.query.fields) {
            const selectedFields = this.query.fields.split(",");
            this.prismaQuery.select = selectedFields.reduce((acc, field) => {
                acc[field] = true;
                return acc;
            }, {});
        }
        return this;
    }
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.prismaQuery.skip = skip;
        this.prismaQuery.take = limit;
        return this;
    }
    build() {
        return this.prismaQuery;
    }
    getMeta(total) {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const totalPage = Math.ceil(total / limit);
        return { page, limit, total, totalPage };
    }
}
//# sourceMappingURL=QueryBuilder.js.map