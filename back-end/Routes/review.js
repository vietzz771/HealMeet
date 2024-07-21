import express from "express";
import { createReview, getAllReviews, updateReview } from "../Controllers/reviewController.js";
import { authenticate, restrict } from "./../auth/verifyToken.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReviews)
  .post(authenticate, restrict(["patient"]), createReview);

router.route("/").put(authenticate, restrict(["patient"]), updateReview);

export default router;
