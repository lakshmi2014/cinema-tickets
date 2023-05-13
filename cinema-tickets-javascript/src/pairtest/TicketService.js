import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService"
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService";

export default class TicketService {
  //Public properties
  totalAmount = 0;
  totalSeatsAllocated = 0;

   //Private properties
  #paymentService;
  #seatReservationService;
  #noOfAdultTickets = 0;
  #noOfChildTickets = 0;
  #noOfInfantTickets = 0;

  // Static properties
  static ADULT_TICKET_PRICE = 20;
  static CHILD_TICKET_PRICE = 10
  static INFANT_TICKET_PRICE = 0;
  
  constructor() {
    this.#paymentService = new TicketPaymentService();
    this.#seatReservationService = new SeatReservationService();
  }
  /**
   * Should only have private methods other than the one below.
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {

    // Validate the inputs
    this.#validateAccountId(accountId);
    this.#validateTicketRequest(...ticketTypeRequests);
    this.#validatePurchaseRequest(...ticketTypeRequests);

    this.totalAmount = this.#calculateTotalAmount();
    this.totalSeatsAllocated = this.#calculateNumberOfSeatsToReserve();
    // make payment
    this.#paymentService.makePayment(accountId, this.totalAmount);
    // reserve seats
    this.#seatReservationService.reserveSeat(accountId, this.totalSeatsAllocated);
  }

  //Calculate the total amount for the requested tickets
  #calculateTotalAmount() {
   return this.#noOfAdultTickets * TicketService.ADULT_TICKET_PRICE + this.#noOfChildTickets * TicketService.CHILD_TICKET_PRICE;
  }

  //Calculate the total number of seats to reserve - no seats for infants
  #calculateNumberOfSeatsToReserve() {
   return this.#noOfAdultTickets + this.#noOfChildTickets;
  }
  
  #validateAccountId(accountId) {
     // If account id is not valid throws InvalidPurchaseException
     if(!Number.isInteger(accountId) || accountId < 1) {
      throw new InvalidPurchaseException();
    }
  }

  #validateTicketRequest(...ticketTypeRequests) {
     // Throw error is total number of ticket requests is 0 or > 20
     if (ticketTypeRequests.length < 1 || ticketTypeRequests.length > 20) {
       throw new InvalidPurchaseException()
     }
  }

  #validatePurchaseRequest(...ticketTypeRequests) {
     //Throw error if atleast one Adult ticket type is not present
     const adultTickets = ticketTypeRequests.find((ticket) => ticket.getTicketType() === "ADULT");

     if (adultTickets === undefined)  {
       throw new InvalidPurchaseException();
     }
     this.#noOfAdultTickets = adultTickets.getNoOfTickets();
 
     //The number of Infant tickets should be less than or equal to adult tickets (if there are infant tickets)
     const infantTickets = ticketTypeRequests.find((ticket) => ticket.getTicketType() === "INFANT");
     if (infantTickets) {
       this.#noOfInfantTickets = infantTickets.getNoOfTickets();
     }
     if (this.#noOfInfantTickets > 0 && this.#noOfInfantTickets > this.#noOfAdultTickets)  throw new InvalidPurchaseException();
 
     //If there are child tickets, get Total number of child tickets
     const childTickets = ticketTypeRequests.find((ticket) => ticket.getTicketType() === "CHILD");
     if (childTickets) {
       this.#noOfChildTickets = childTickets.getNoOfTickets();
     }
  }
}
