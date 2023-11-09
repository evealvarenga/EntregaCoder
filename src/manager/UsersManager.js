import { usersModel } from "../db/models/users.model.js";

class UsersManager {
    async findAll(obj) {
        const { limit = 20, page = 1, ...filter } = obj;

        const response = await usersModel.paginate(filter, { limit, page });
        const info = {
            count: response.totalDocs,
            pages: response.totalPages,
            next: response.hasNextPage
                ? `http://localhost:8080/api/users?page=${response.nextPage}`
                : null,
            prev: response.hasPrevPage
                ? `http://localhost:8080/api/users?page=${response.prevPage}`
                : null,
        };
        const results = response.docs;
        return { info, results };
    }

    async findById(id) {
        const response = await usersModel.findById(id).explain("executionStats");
        return response;
    }

    async findByEmail(email) {
        const response = await usersModel
            .findOne({ email });
        return response;
    }

    async createOne(obj) {
        const response = await usersModel.create(obj);
        return response;
    }

    async updateOne(id, obj) {
        const response = await usersModel.updateOne({ _id: id }, obj);
        return response;
    }

    async deleteOne(id) {
        const response = await usersModel.deleteOne({ _id: id });
        return response;
    }
}

export const usersManager = new UsersManager();