import { Request, Response, json, query } from "express";
import User from "../auth/auth.model";
import Text from "./text.model";
import { IUser } from "../auth/auth.interface";
import AppError from "../../../error/AppError";
import { responseSuccess } from "../../../utils/responseSuccess";

export const createText = async (req: Request, res: Response) => {
  try {
    const {text}=req.body;
    const userID=req.user?._id;
    
    const newText = await Text.create({ text,textCreator:userID });

     res.status(200).send({ message: "success", newText: newText });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong, Please try again");
  }
};
// Delete Text
export const deleteText = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedText = await Text.findByIdAndDelete(id);
    if (deletedText) {
      res.json({ message: "Text deleted successfully", deletedText });
    } else {
      res.status(404).json({ message: "Text not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete text" });
  }
};

// Update Text
export const updateText = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const updatedText = await Text.findByIdAndUpdate(id, { text }, { new: true });
    if (updatedText) {
      res.json({ message: "Text updated successfully", updatedText });
    } else {
      res.status(404).json({ message: "Text not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update text" });
  }
};

// Read Text
export const readText = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundText = await Text.findById(id);
    if (foundText) {
      res.json({ message: "Text found", foundText });
    } else {
      res.status(404).json({ message: "Text not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to read text" });
  }
};
// Create an API to return the number of words
export const countWords = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundText = await Text.findById(id);
    if (foundText) {
      const words = foundText.text.split(/\s+/).filter(word => word !== '');
      const wordCount = words.length;
      res.json({ message: "Word count", text:foundText?.text,countWord:wordCount });
    } else {
      res.status(404).json({ message: "Text not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to count words" });
  }
};
// Create an API to return the number of characters
export const countCharacters = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundText = await Text.findById(id);
    if (foundText) {
     // Remove whitespace characters from the text
     const textWithoutWhitespace = foundText.text.replace(/\s/g, '');

     // Count characters in the modified text
     const characterCount = textWithoutWhitespace.length;
      res.json({ message: "Character count",text:foundText?.text, characterCount });
    } else {
      res.status(404).json({ message: "Text not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to count characters" });
  }
};
// Create an API to return the number of sentences
export const countSentences = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundText = await Text.findById(id);
    if (foundText) {
      const sentences = foundText.text.split(/[.!?]+/).filter(sentence => sentence !== '');
      const sentenceCount = sentences.length;
      res.json({ message: "Sentence count",text:foundText?.text, sentenceCount });
    } else {
      res.status(404).json({ message: "Text not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to count sentences" });
  }
};
// Create an API to return the number of paragraphs
export const countParagraphs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundText = await Text.findById(id);
    if (foundText) {
      const paragraphs = foundText.text.split(/\n+/).filter(paragraph => paragraph !== '');
      const paragraphCount = paragraphs.length;
      res.json({ message: "Paragraph count",text:foundText?.text, paragraphCount });
    } else {
      res.status(404).json({ message: "Text not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to count paragraphs" });
  }
};
// Create an API to return the longest words in paragraphs
export const longestWordsInParagraphs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundText = await Text.findById(id);
    if (foundText) {
      const paragraphs = foundText.text.split(/\n+/).filter(paragraph => paragraph !== '');
      const longestWords = paragraphs.map(paragraph => {
        const words = paragraph.split(/\s+/).filter(word => word !== '');
        const longestWord = words.reduce((longest, current) => current.length > longest.length ? current : longest, '');
        return longestWord;
      });
      res.json({ message: "Longest words in paragraphs",text:foundText?.text, longestWords });
    } else {
      res.status(404).json({ message: "Text not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to find longest words in paragraphs" });
  }
};
export const getSingleTextAnalysisReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Retrieve the text from the database and populate the text creator information
    const foundText = await Text.findById(id).populate({
      path: 'textCreator',
      select: 'userName email -_id' // Specify the fields to include (userName and email) and exclude (_id)
    });
    if (!foundText) {
      return res.status(404).json({ message: "Text not found" });
    }

    // Extract text creator information
    const textCreator = foundText.textCreator;

    // Perform analysis on the text
    const text = foundText.text;
    const wordCount = text.split(/\s+/).filter(word => word !== '').length;
    const characterCount = text.length;
    const sentenceCount = text.split(/[.!?]+/).filter(sentence => sentence !== '').length;
    const paragraphCount = text.split(/\n+/).filter(paragraph => paragraph !== '').length;
    const paragraphs = text.split(/\n+/).filter(paragraph => paragraph !== '');
    const longestWords = paragraphs.map(paragraph => {
      const words = paragraph.split(/\s+/).filter(word => word !== '');
      return words.reduce((longest, current) => current.length > longest.length ? current : longest, '');
    });

    // Construct the report object
    const report = {
      wordCount,
      characterCount,
      sentenceCount,
      paragraphCount,
      longestWords,
    };

    // Send the report as a response
    res.json({ message: "Text analysis report",TextCreator:textCreator,TextReport: report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate text analysis report" });
  }
};
export const getAllUsersTextAnalysisReports = async (req: Request, res: Response) => {
  try {
    // Retrieve all texts from the database and populate the text creator information
    const allTexts = await Text.find().populate({
      path: 'textCreator',
      select: 'userName email -_id' // Specify the fields to include (userName and email) and exclude (_id)
    });
    let result:any=[]

    // Iterate over each text
    allTexts.forEach(element => {
      const user = element.textCreator
      const report = analyzeText(element.text);
      
      // Add user information and text analysis report to the result array
      result.push({ users: user, report: report });
    });


    // Send the user information and text analysis reports as a response
    res.json({ message: "User text analysis reports", userReports:result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve user text analysis reports" });
  }
};
const analyzeText = (text: string) => {
  const wordCount = text.split(/\s+/).filter(word => word !== '').length;
  const characterCount = text.length;
  const sentenceCount = text.split(/[.!?]+/).filter(sentence => sentence !== '').length;
  const paragraphCount = text.split(/\n+/).filter(paragraph => paragraph !== '').length;
  const paragraphs = text.split(/\n+/).filter(paragraph => paragraph !== '');
  const longestWords = paragraphs.map(paragraph => {
    const words = paragraph.split(/\s+/).filter(word => word !== '');
    return words.reduce((longest, current) => current.length > longest.length ? current : longest, '');
  });

  return {
    wordCount,
    characterCount,
    sentenceCount,
    paragraphCount,
    longestWords
  };
};