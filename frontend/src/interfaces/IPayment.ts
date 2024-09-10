export interface PaymentInterface {
    ID?: number;
    TotalPrice: number;
    Status: string;
    PaymentTime: Date;
    MemberID?: number;
    TicketID?: number;
  }
  