import { NextFunction, Request, Response } from "express";
import AppError from "../../error/AppError";
import { MongooseError } from "mongoose";

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let statusCode = 500;
	let message = "Internal Server Error";

	if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;
	} else if (err instanceof MongooseError) {
		// Handle Mongoose-specific errors
		statusCode = 400; // You can choose an appropriate status code
		message = err.message;
	}

	return res.status(statusCode).json({
		success: false,
		message: message,
	});
};
