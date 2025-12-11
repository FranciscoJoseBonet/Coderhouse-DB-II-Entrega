import UserMongoDAO from "../daos/mongo/user.mongo.dao.js";

const userDAO = new UserMongoDAO();

class UserRepository {
	constructor(dao = userDAO) {
		this.dao = dao;
	}

	async findUserById(id) {
		return this.dao.getById(id);
	}

	async findUserByEmail(email) {
		return this.dao.getByEmail(email);
	}

	async saveUser(user) {
		return this.dao.create(user);
	}

	async updateUser(id, data) {
		return this.dao.update(id, data);
	}

	async deleteUser(id) {
		return this.dao.delete(id);
	}
}

export default UserRepository;
