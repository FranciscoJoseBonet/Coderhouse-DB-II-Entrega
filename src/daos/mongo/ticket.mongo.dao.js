import TicketModel from "../../models/ticket.model.js";

class TicketMongoDAO {
	async create(ticketData) {
		return TicketModel.create(ticketData);
	}

	async getById(tid) {
		return TicketModel.findById(tid).lean();
	}
}

export default TicketMongoDAO;
