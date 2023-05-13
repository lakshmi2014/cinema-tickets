import TicketService from "../src/pairtest/TicketService";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException.js';
import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService";
import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService";
jest.mock("../src/pairtest/lib/TicketTypeRequest");
jest.mock("../src/thirdparty/paymentgateway/TicketPaymentService")
describe("purchaseTicket", () => {
   let ticketService;
  beforeEach(() => {
    const paymentService = new TicketPaymentService();
    const seatReservationService = new SeatReservationService();
    ticketService = new TicketService(paymentService, seatReservationService);
  });

  it ('throws InvalidPurchaseException account id is zero', () => {
    //given
    const obj = new TicketTypeRequest();
    jest.spyOn(obj, "getNoOfTickets").mockReturnValue(1);
    jest.spyOn(obj, "getTicketType").mockReturnValue('ADULT');
  
    //When 
    try {
     ticketService.purchaseTickets(0, ...[obj]);
    } catch (e) {
      // then
      expect(e).toBeInstanceOf(InvalidPurchaseException);
      // asserts no payment made and no seats reserved
      expect(ticketService.totalAmount).toBe(0);
      expect(ticketService.totalSeatsAllocated).toBe(0);
    }
  })  

  it ('throws InvalidPurchaseException account id is a negative number', () => {
    //given
    const obj = new TicketTypeRequest();
    jest.spyOn(obj, "getNoOfTickets").mockReturnValue(1);
    jest.spyOn(obj, "getTicketType").mockReturnValue('ADULT');
  
    //When 
    try {
     ticketService.purchaseTickets(-1, ...[obj]);
    } catch (e) {
      // then
      expect(e).toBeInstanceOf(InvalidPurchaseException);
      // asserts no payment made and no seats reserved
      expect(ticketService.totalAmount).toBe(0);
      expect(ticketService.totalSeatsAllocated).toBe(0);
    }
  })  

  it ('throws InvalidPurchaseException account id is not an integer', () => {
    //given
    const obj = new TicketTypeRequest();
    jest.spyOn(obj, "getNoOfTickets").mockReturnValue(1);
    jest.spyOn(obj, "getTicketType").mockReturnValue('ADULT');
  
    //When 
    try {
     ticketService.purchaseTickets('1', ...[obj]);
    } catch (e) {
      // then
      expect(e).toBeInstanceOf(InvalidPurchaseException);
      // asserts no payment made and no seats reserved
      expect(ticketService.totalAmount).toBe(0);
      expect(ticketService.totalSeatsAllocated).toBe(0);
    }
  }) 

  it ('throws InvalidPurchaseException when requested tickets are empty', () => {
    //When 
    try {
     ticketService.purchaseTickets(1, ...[]);
    } catch (e) {
      // then
      expect(e).toBeInstanceOf(InvalidPurchaseException);
      // asserts no payment made and no seats reserved
      expect(ticketService.totalAmount).toBe(0);
      expect(ticketService.totalSeatsAllocated).toBe(0);
    }
  })  

  it ('throws InvalidPurchaseException when total number of tickets is zero', () => {
    //given
    const obj = new TicketTypeRequest();
    jest.spyOn(obj, "getNoOfTickets").mockReturnValue(0);
    jest.spyOn(obj, "getTicketType").mockReturnValue('ADULT');
    //When 
    try {
     ticketService.purchaseTickets(1, ...[obj]);
    } catch (e) {
      // then
      expect(e).toBeInstanceOf(InvalidPurchaseException);
      // asserts no payment made and no seats reserved
      expect(ticketService.totalAmount).toBe(0);
      expect(ticketService.totalSeatsAllocated).toBe(0);
    }
  })  

  it ('throws InvalidPurchaseException when total number of tickets is greater then 20', () => {
    //given
    const obj = new TicketTypeRequest();
    jest.spyOn(obj, "getNoOfTickets").mockReturnValue(21);
    jest.spyOn(obj, "getTicketType").mockReturnValue('ADULT');
  
    //When 
    try {
     ticketService.purchaseTickets(1, ...[obj]);
    } catch (e) {
      // then
      expect(e).toBeInstanceOf(InvalidPurchaseException);
      // asserts no payment made and no seats reserved
      expect(ticketService.totalAmount).toBe(0);
      expect(ticketService.totalSeatsAllocated).toBe(0);
    }
  })  

  it ('throws InvalidPurchaseException when requested tickets contains only INFANT tickets', () => {
    //given
    const obj = new TicketTypeRequest();
    jest.spyOn(obj, "getNoOfTickets").mockReturnValue(2);
    jest.spyOn(obj, "getTicketType").mockReturnValue('INFANT');
  
   //When 
   try {
    ticketService.purchaseTickets(1, ...[obj]);
   } catch (e) {
     // then
     expect(e).toBeInstanceOf(InvalidPurchaseException);
     // asserts no payment made and no seats reserved
     expect(ticketService.totalAmount).toBe(0);
     expect(ticketService.totalSeatsAllocated).toBe(0);
   }
  })  

  it ('throws InvalidPurchaseException when requested tickets contains only CHILD tickets', () => {
    //given
    const obj = new TicketTypeRequest();
    jest.spyOn(obj, "getNoOfTickets").mockReturnValue(1);
    jest.spyOn(obj, "getTicketType").mockReturnValue('CHILD');
  
   //When 
   try {
    ticketService.purchaseTickets(1, ...[obj]);
   } catch (e) {
     // then
     expect(e).toBeInstanceOf(InvalidPurchaseException);
     // asserts no payment made and no seats reserved
     expect(ticketService.totalAmount).toBe(0);
     expect(ticketService.totalSeatsAllocated).toBe(0);
   }
  })  

  it ('throws InvalidPurchaseException when requested tickets contains only CHILD and INFANT tickets', () => {
    //given
    const obj1 = new TicketTypeRequest();
    jest.spyOn(obj1, "getNoOfTickets").mockReturnValue(1);
    jest.spyOn(obj1, "getTicketType").mockReturnValue('INFANT');

    const obj2 = new TicketTypeRequest();
    jest.spyOn(obj2, "getNoOfTickets").mockReturnValue(1);
    jest.spyOn(obj2, "getTicketType").mockReturnValue('CHILD');
  
   //When 
   try {
    ticketService.purchaseTickets(1, ...[obj1, obj2]);
   } catch (e) {
     // then
     expect(e).toBeInstanceOf(InvalidPurchaseException);
     // asserts no payment made and no seats reserved
     expect(ticketService.totalAmount).toBe(0);
     expect(ticketService.totalSeatsAllocated).toBe(0);
   }
  })  
  
  it ('throws InvalidPurchaseException when requested tickets contains more INFANT tickets than ADULT tickets', () => {
    //given
    const obj1 = new TicketTypeRequest();
    jest.spyOn(obj1, "getNoOfTickets").mockReturnValue(1);
    jest.spyOn(obj1, "getTicketType").mockReturnValue('ADULT');

    const obj2 = new TicketTypeRequest();
    jest.spyOn(obj2, "getNoOfTickets").mockReturnValue(2);
    jest.spyOn(obj2, "getTicketType").mockReturnValue('INFANT');
  
   //When 
   try {
    ticketService.purchaseTickets(1, ...[obj1, obj2]);
   } catch (e) {
     // then
     expect(e).toBeInstanceOf(InvalidPurchaseException);
     // asserts no payment made and no seats reserved
     expect(ticketService.totalAmount).toBe(0);
     expect(ticketService.totalSeatsAllocated).toBe(0);
   }
  })   

  it ('returns undefined when requested tickets contains only ADULT tickets', () => {
  //given
  const obj = new TicketTypeRequest();
  jest.spyOn(obj, "getNoOfTickets").mockReturnValue(2);
  jest.spyOn(obj, "getTicketType").mockReturnValue('ADULT');

  //When + then
  expect(ticketService.purchaseTickets(1, ...[obj])).toBe(undefined);
  // asserts the correct amount and correct number of seats reserved
  expect(ticketService.totalAmount).toBe(40);
  expect(ticketService.totalSeatsAllocated).toBe(2);
 })  

 it ('returns undefined when requested tickets contains only ADULT and CHILD tickets', () => {
  //given
  const obj1 = new TicketTypeRequest();
  jest.spyOn(obj1, "getNoOfTickets").mockReturnValue(1);
  jest.spyOn(obj1, "getTicketType").mockReturnValue('ADULT');

  const obj2 = new TicketTypeRequest();
  jest.spyOn(obj2, "getNoOfTickets").mockReturnValue(2);
  jest.spyOn(obj2, "getTicketType").mockReturnValue('CHILD');

  //When + then
  expect(ticketService.purchaseTickets(1, ...[obj1, obj2])).toBe(undefined)
  // asserts the correct amount and correct number of seats reserved
  expect(ticketService.totalAmount).toBe(40);
  expect(ticketService.totalSeatsAllocated).toBe(3);
 })  

 it ('returns undefined when requested INFANT tickets less than or equal to ADULT tickets ', () => {
  //given
  const obj1 = new TicketTypeRequest();
  jest.spyOn(obj1, "getNoOfTickets").mockReturnValue(1);
  jest.spyOn(obj1, "getTicketType").mockReturnValue('ADULT');

  const obj2 = new TicketTypeRequest();
  jest.spyOn(obj2, "getNoOfTickets").mockReturnValue(1);
  jest.spyOn(obj2, "getTicketType").mockReturnValue('INFANT');

  //When + then
  expect(ticketService.purchaseTickets(1, ...[obj1, obj2])).toBe(undefined)
  // asserts the correct amount and correct number of seats reserved
  expect(ticketService.totalAmount).toBe(20);
  expect(ticketService.totalSeatsAllocated).toBe(1);
 });
})
