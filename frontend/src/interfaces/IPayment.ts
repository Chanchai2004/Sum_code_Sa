export interface PaymentInterface {
    ID?: number;
    TotalPrice: number;
    Status: string;
    PaymentTime: Date;
    Slip?: File | Blob;
    MemberID?: number;
    TicketID?: number;
  }
  