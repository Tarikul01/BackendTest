import { Types } from "mongoose";

export interface IText {
    text: string,
    textCreator:Types.ObjectId;
}