export interface RewardInterface {
    ID: number;
    imageUrl: string;
    RewardName?: string;
    Discount?:   number;
    Status?:     boolean;
    Points?:    number;
    Reward_time?: Date;
    Describtion?: string;
    Type?: string;

    member_id?: number;

    
}