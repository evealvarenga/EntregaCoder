export default class UsersResponse {
    constructor(user) {
        this.id = user.id;
        this.name = user.name.split(" ")[0];
        this.last_name = user.name.split(" ")[1];
        this.email = user.email;
        this.role = user.role
    }
    static fromModel(user) {
        return new UsersResponse(user);
    }
}