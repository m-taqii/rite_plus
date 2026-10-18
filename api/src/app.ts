import express from 'express';
import type { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRoute from "./modules/user/user.route.ts"

const app = express();

const corsOptions = {
    origin: "*",
    credentials: true,
};

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions))

app.use("/user", userRoute);

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: "success",
        message: "API is running",
    })
});

export default app;