export default class BasicMongo {
    constructor(model) {
        this.model = model;
    }

    async getAll() {
        const response = await this.model.find();
        return response
    }

    async getById(id) {
        const response = await this.model.findById(id);
        return response
    }

    async createOne(obj) {
        const response = await this.model.create(obj);
        return response
    }

    async deleteOne(id){
        const response = await this.model.findByIdAndDelete(id);
        return response
    }

    async updateOne(id, obj){
        const response = await this.model.updateOne({ _id: id }, obj);
        return response
    }
}