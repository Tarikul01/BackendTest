import { Request, Response, json, query } from "express";
import User from "../auth/auth.model";
import Text from "./text.model";
import { IUser } from "../auth/auth.interface";
import AppError from "../../../error/AppError";
import { responseSuccess } from "../../../utils/responseSuccess";

export const createText = async (req: Request, res: Response) => {
  try {
    const {text}=req.body;
    
    const newText = await Text.create({ text });

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
