import mongoose, { Schema, model } from "mongoose";
import { IFriends } from "./friends.interface";

const friendInvitationSchema = new Schema<IFriends>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const FriendInvitation = model<IFriends>(
  "FriendInvitation",
  friendInvitationSchema
);
export default FriendInvitation;
