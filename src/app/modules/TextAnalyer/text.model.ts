import { Schema, model } from "mongoose";
import { IText } from "./text.interface";

const textSchema = new Schema<IText>(
  {
    text:{type:String},
    
    textCreator: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
