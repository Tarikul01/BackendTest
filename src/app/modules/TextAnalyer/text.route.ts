import express from "express";
import { createText, deleteText, readText, updateText } from "./text.controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();

// router.route("/requests/recieved").get(auth("user"), getFriendsRequest);
// router.route("/requests/sent").get(auth("user"), getSentRequests);
// router.route("/check/:id").get(auth("user"), checkFriendsOrNot);
// router.route("/accept/:id").post(auth("user"), friendsAccept);
// router.route("/reject/:id").delete(auth("user"), friendsReject);
// router.route("/all-friends-groups").get(auth("user"), getAllFriendsAndGroups);
// router.route("/groups").get(auth("user"), getAllFriendsAndGroups);
// router.route("/invite").post(auth("user"), friendsInvitation);
router.route("/").post(auth("user"), createText);

router.route("/:id").get(auth("user"), readText).delete(auth("user"), deleteText).put(auth("user"), updateText);

export const textRouter = router;
