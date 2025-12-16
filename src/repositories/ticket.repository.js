import TicketMongoDAO from "../daos/mongo/TicketMongoDAO.js";

const ticketDAO = new TicketMongoDAO();

class TicketRepository {
	constructor(dao = ticketDAO) {
		this.dao = dao;
	}

	async generateTicket(ticketData) {
		return this.dao.create(ticketData);
	}

	async findTicketById(id) {
		return this.dao.getById(id);
	}
}

export default TicketRepository;
