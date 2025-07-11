export interface ReviewDto {
    sessionId: number;
    reviewerId: string;
    revieweeId: string;
    rate: number;
    text: string;
    type: number; // 0 = ClientToLawyer, 1 = LawyerToClient
}
