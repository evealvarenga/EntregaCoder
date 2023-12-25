export default class UsersResponse {
    constructor(user) {
        this.name = user.name.split(" ")[0];
        this.last_name = user.name.split(" ")[1];
        this.email = user.email;
    }
}