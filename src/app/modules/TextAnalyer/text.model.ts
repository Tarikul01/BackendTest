import { Schema, model } from "mongoose";
import { IText } from "./text.interface";

const textSchema = new Schema<IText>(
  {
    text:{type:String}
  },
  {
    timestamps: true,
  }
);

const Text = model<IText>(
  "Text",
  textSchema
);
export default Text;
