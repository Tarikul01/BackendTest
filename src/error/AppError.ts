class AppError extends Error {
	constructor(public statusCode: number, public message: string) {
		super(message);
		this.name = this.constructor.name;
	}
}

export default AppError;
