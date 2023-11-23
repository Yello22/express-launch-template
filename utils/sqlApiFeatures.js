class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => delete queryObj[el]);

        // Advanced filtering
        const sequelizeOperatorsMap = {
            gte: '$gte',
            gt: '$gt',
            lte: '$lte',
            lt: '$lt'
        };

        const whereClause = {};
        Object.keys(queryObj).forEach((key) => {
            if (sequelizeOperatorsMap[key]) {
                whereClause[key] = {
                    [sequelizeOperatorsMap[key]]: queryObj[key]
                };
            } else {
                whereClause[key] = queryObj[key];
            }
        });

        this.query = this.query.findAll({ where: whereClause });

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").map(field => field.trim());
            this.query = this.query.orderBy(sortBy);
        } else {
            this.query = this.query.orderBy(['createdAt']);
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").map(field => field.trim());
            this.query = this.query.select(fields);
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const offset = (page - 1) * limit;

        this.query = this.query.offset(offset).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;
