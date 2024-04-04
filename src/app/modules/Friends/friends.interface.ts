import { Types } from "mongoose";

export interface IFriends {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
}