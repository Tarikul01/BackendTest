import express from "express";
import {
  friendsInvitation,
  friendsAccept,
  friendsReject,
  getFriends,
  getFriendsRequest,
  checkFriendsOrNot,
  getAllFriendsAndGroups,
  getSentRequests,
} from "./friends.controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.route("/requests/recieved").get(auth("user"), getFriendsRequest);
router.route("/requests/sent").get(auth("user"), getSentRequests);
router.route("/check/:id").get(auth("user"), checkFriendsOrNot);
router.route("/accept/:id").post(auth("user"), friendsAccept);
router.route("/reject/:id").delete(auth("user"), friendsReject);
router.route("/all-friends-groups").get(auth("user"), getAllFriendsAndGroups);
router.route("/groups").get(auth("user"), getAllFriendsAndGroups);
router.route("/invite").post(auth("user"), friendsInvitation);
router.route("/").get(auth("user"), getFriends);

export const friendsRoute = router;
