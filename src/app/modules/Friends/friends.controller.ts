import { Request, Response, json, query } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IFriends } from "./friends.interface";
import User from "../auth/auth.model";
import FriendInvitation from "./friends.model";
import { IUser } from "../auth/auth.interface";
import AppError from "../../../error/AppError";
import { responseSuccess } from "../../../utils/responseSuccess";
import Group from "../group/group.model";
import { invitationEmail } from "../../../utils/invitationEmail";

export const getFriends = async (req: Request, res: Response) => {
  try {
    const Friends = (await User.find({ _id: req?.user?._id }).populate({
      path: "friends",
      select: "_id userName email createdAt",
    })) as IUser[];
    // Extract friends from each document and send as response
    const allFriends = Friends.map((user) => user.friends).flat();

    return res.status(200).send({ message: "success", data: allFriends });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong, Please try again");
  }
};
export const getFriendsRequest = async (req: Request, res: Response) => {
  try {
    const id = req?.user?._id;
    
    const friendsRequest = (await FriendInvitation.find({
      receiverId: id,
    }).populate({
      path: "senderId",
      select: "_id userName email createdAt",
    })) as IUser[];
    return res.status(200).send({
      success: true,
      message: "success",
      data: friendsRequest
    });
    
  } catch (error) {
    console.log('getSentRequests error: ', error);
    return res.status(500).json({
      success: false,
      error
    });
  }
};

export const getSentRequests = async (req: Request, res: Response) => {
  try {
    const id = req?.user?._id;
    
    const friendsRequest = (await FriendInvitation.find({
      senderId: id,
    }).populate({
      path: "receiverId",
      select: "_id userName email createdAt",
    })) as IUser[];
    
    return res.status(200).send({
      success: true,
      message: "success",
      data: friendsRequest
    });
    
  } catch (error) {
    console.log('getSentRequests error: ', error);
    return res.status(500).json({
      success: false,
      error
    });
  }
};

export const friendsInvitation = async (req: Request, res: Response) => {
  const { targetFriend } = req.body;
  if (!targetFriend) {
    // return res.status(404).send("Invalid  body !");
    throw new AppError(404, "Invalid  body !");
  }

  const currentUserId = req.user?._id;
  const email = req.user?.email;
  const phone = req.user?.phone;

  // console.log("CurrentUser", targetFriend, currentUserId, email, phone);
  // check if friend that we would like to nivite is not user
  if (email.toLowerCase() === targetFriend?.toLowerCase()) {
    // return res
    //   .status(409)
    //   .send("Sorry. You cannot become friend with yourself");
    throw new AppError(409, "Sorry. You cannot become friend with yourself");
  }
  // const targetUser = await User.findOne({
  //   email: targetMailAddress.toLowerCase(),
  // });
  // res.json({ email: targetFriend });
  try {
    const targetUser = await User.findOne({
      $or: [{ email: targetFriend.toLowerCase() }],
    });

    console.log("TargetUser", targetUser);
    if (!targetUser) {
      // return res
      // .status(404)
      // .send(
      //   `Friend of ${targetFriend} has not been found. Please check mail address`
      // );

      throw new AppError(
        404,
        `Friend of ${targetFriend} has not been found. Please check mail address`
      );
    }
    //   check if invitation already send or not
    const invitationAlreadyReceived: any = await FriendInvitation.findOne({
      senderId: currentUserId,
      receiverId: targetUser._id,
    });

    if (invitationAlreadyReceived) {
      // return res.status(409).send("Invitation has been already sent");
      throw new AppError(409, "Invitation has been already sent");
    }

    // Check  the requested friend is already friend or not

    const userAlreadyFriends = targetUser?.friends?.find(
      (friendId) => friendId.toString() === currentUserId.toString()
    );

    if (userAlreadyFriends) {
      // return res
      //   .status(409)
      //   .send("Friends already added. Please check friends list");
      throw new AppError(
        409,
        "Friends already added. Please check friends list"
      );
    }
    //  Create a new Invitations in database

    const newInvitation = await FriendInvitation.create({
      senderId: currentUserId,
      receiverId: targetUser._id,
    });
    const sender = await User.findById(currentUserId);
    const receiver = await User.findById(targetUser._id);

    const sendEmail = await invitationEmail(sender, receiver);
    console.log(sendEmail);
    //   send pending invitations update to  specific user
    // friendsUpdate.updateFriendPendingInvitations(targetUser._id.toString());

    return res.status(201).json({
      success: true,
      message: "Invitation has been sent !",
      data: newInvitation,
    });
  } catch (error: any) {
    // console.log(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const friendsAccept = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const invitation = await FriendInvitation.findOne({
      _id: id,
      receiverId: req?.user?._id,
    });
    if (!invitation) {
      return res.status(201).send("You  haven't any friends requests !");
    }
    const { senderId, receiverId } = invitation;
    //add friend to both users
    const sendUser = await User.findById(senderId);
    if (sendUser) {
      sendUser.friends = [...(sendUser.friends || []), receiverId];
      await sendUser.save(); // Save the updated user document
    }

    const receiveUser = await User.findById(receiverId);

    if (receiveUser) {
      receiveUser.friends = [...(receiveUser.friends || []), senderId];

      await receiveUser.save();
    }

    //  delete Invitations
    await FriendInvitation.findByIdAndDelete(id);

    //update list of the friends if the users are online
    //  friendUpdate.updateFriends(senderId.toString());
    //  friendUpdate.updateFriends(receiverId.toString());

    //  update list of friends pending invitaitons
    // friendUpdate.updateFriendPendingInvitations(receiverId.toString());

    return res.status(200).send("Friends successfully added");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong, Please try again");
  }
};

export const friendsReject = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.user?._id;
    console.log("**check RejectInviation", id, userId);

    // remove that invitations from friend invitations collections
    const invitationsExit = await FriendInvitation.exists({ _id: id });

    if (invitationsExit) {
      await FriendInvitation.findByIdAndDelete(id);
    }

    // update Pending Invitations
    //   friends.updateFriendPendingInvitations(userId);

    return res.status(200).send("Invitations successfully rejected!");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong please try again!");
  }
};

export const checkFriendsOrNot = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    if (!req?.user) {
      throw new AppError(403, "You are not authorized");
    }
    const user = await User.findById(req?.user._id).select("friends");
    if (!user) {
      throw new AppError(404, "User not found");
    }
    const friends: any = user?.friends;

    if (friends?.includes(id)) {
      res.json(responseSuccess("You are friends", true, 200));
    } else {
      res.json(responseSuccess("You are not friends", false, 200));
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllFriendsAndGroups = async (req: Request, res: Response) => {
  try {
    if (!req?.user) {
      throw new AppError(403, "You are not authorized");
    }
    const user = await User.findById(req.user._id)
      .populate({
        path: "friends",
        select: "userName email createdAt",
      })
      .select("friends");
    if (!user) {
      throw new AppError(404, "User not found");
    }
    const friends: any = user?.friends;
    const groups: any = await Group.find({ "members.user": req.user._id });
    res.json(responseSuccess("You are friends", { friends, groups }, 200));
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
