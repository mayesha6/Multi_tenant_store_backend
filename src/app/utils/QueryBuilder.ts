type PrismaQueryOptions<T> = {
  where?: T;
  orderBy?: any;
  skip?: number;
  take?: number;
  select?: any;
};

export class QueryBuilder<TWhereInput = any> {
  public readonly query: Record<string, string>;
  private prismaQuery: PrismaQueryOptions<TWhereInput> = {};

  constructor(query: Record<string, string>) {
    this.query = query;
  }

  filter(): this {
    const filter = { ...this.query };

    const excludeFields = ["searchTerm", "sort", "page", "limit", "fields"];
    excludeFields.forEach((field) => delete filter[field]);

    this.prismaQuery.where = {
      ...(this.prismaQuery.where || {}),
      ...filter,
    } as TWhereInput;

    return this;
  }

  search(searchableFields: string[]): this {
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
      } as TWhereInput;
    }

    return this;
  }

  sort(): this {
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

  fields(): this {
    if (this.query.fields) {
      const selectedFields = this.query.fields.split(",");

      this.prismaQuery.select = selectedFields.reduce(
        (acc, field) => {
          acc[field] = true;
          return acc;
        },
        {} as Record<string, boolean>
      );
    }

    return this;
  }

  paginate(): this {
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

  getMeta(total: number) {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return { page, limit, total, totalPage };
  }
}