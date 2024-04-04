import express from "express";
import { countCharacters, countParagraphs, countSentences, countWords, createText, deleteText, getAllUsersTextAnalysisReports, getSingleTextAnalysisReport, longestWordsInParagraphs, readText, updateText } from "./text.controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.route("/").post(auth("user"), createText);

router.route("/text_analyzer_report").get(auth("user"), getAllUsersTextAnalysisReports);

router.route("/:id").get(auth("user"), readText).delete(auth("user"), deleteText).put(auth("user"), updateText);
router.route("/count_words/:id").get(auth("user"), countWords);
router.route("/count_characters/:id").get(auth("user"), countCharacters);
router.route("/count_sentences/:id").get(auth("user"), countSentences);
router.route("/count_paragraphs/:id").get(auth("user"), countParagraphs);
router.route("/longest_words/:id").get(auth("user"), longestWordsInParagraphs);
router.route("/text_analyzer_report/:id").get(auth("user"), getSingleTextAnalysisReport);


export const textRouter = router;
