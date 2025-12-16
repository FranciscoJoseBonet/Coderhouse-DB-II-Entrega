export default class TicketDTO {
	constructor(ticket) {
		this.id = ticket._id || ticket.id;
		this.code = ticket.code;
		this.purchase_datetime = ticket.purchase_datetime;
		this.amount = ticket.amount;
		this.purchaser = ticket.purchaser;
	}
}
