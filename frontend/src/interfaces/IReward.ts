export interface RewardInterface {
    ID: number;
    imageUrl: string;
    RewardName?: string;
    Discount?:   number;
    Rewardcode?:  string;
    Status?:     boolean;
    Points?:    number;
    Reward_time?: Date;
    Describtion?: string;
    Type?: string;
    ExpirationDate?:    Date;
    
    member_id?: number;

    
}