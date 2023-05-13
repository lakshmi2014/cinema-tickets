import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";
describe("ticketTypeRequest", () => {
  it ('throws InvalidPurchaseException when no of ticket is not an integer', () => {
    //given + when
    try {
      const obj = new TicketTypeRequest('ADULT', "2");
    } catch (e) {
      // then
      expect(e).toBeInstanceOf(TypeError);
      expect(e.message).toBe('noOfTickets must be an integer');
    }
  });

  it ('throws InvalidPurchaseException when ticket type is invalid', () => {
    //given + when
    try {
      const obj = new TicketTypeRequest('FAMILY', 2);
    } catch (e) {
      // then
      expect(e).toBeInstanceOf(TypeError);
      expect(e.message).toBe('type must be ADULT, CHILD, or INFANT');
    }
  });

  it('ticketTypeRequest with adult ticket type', () => {
    //given + when
    const obj = new TicketTypeRequest('ADULT', 2);
    // then
    expect(obj.getTicketType()).toBe('ADULT');
    expect(obj.getNoOfTickets()).toBe(2);
  });

  it('ticketTypeRequest with CHILD ticket type', () => {
    //given + when
    const obj = new TicketTypeRequest('CHILD', 2);
    // then
    expect(obj.getTicketType()).toBe('CHILD');
    expect(obj.getNoOfTickets()).toBe(2);
  });

  it('ticketTypeRequest with INFANT ticket type', () => {
    //given + when
    const obj = new TicketTypeRequest('INFANT', 2);
    // then
    expect(obj.getTicketType()).toBe('INFANT');
    expect(obj.getNoOfTickets()).toBe(2);
  });
})
