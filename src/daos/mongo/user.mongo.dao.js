import UserModel from "../../models/user.model.js";

class UserMongoDAO {
	async getById(uid) {
		return UserModel.findById(uid).lean();
	}

	async getByEmail(email) {
		return UserModel.findOne({ email }).lean();
	}

	async create(user) {
		return UserModel.create(user);
	}

	async update(uid, data) {
		return UserModel.findByIdAndUpdate(uid, { $set: data }, { new: true }).lean();
	}

	async delete(uid) {
		return UserModel.findByIdAndDelete(uid).lean();
	}
}

export default UserMongoDAO;
