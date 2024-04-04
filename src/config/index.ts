import dotenv from "dotenv";
import path from "path";
dotenv.config({
	path: path.join(process.cwd(), ".env"),
});

export default {
	port: process.env.PORT,
	mongo_url:
		process.env["NODE_ENV"] === "production"
			? process.env["MONGO_PROD_URL"]
			: process.env["MONGO_LOCAL_URL"],
	node_env: process.env.NODE_ENV,
	bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
	jwt_secret: process.env.JWT_SECRET,
};
