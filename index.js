const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieparser = require("cookie-parser");
const dbConnectModule = require("./utils/db");
const userRouter = require("./routes/userRoutes");
const companyRouter = require("./routes/companyRoutes");
const jobRouter = require("./routes/jobRoutes");
const applicationRouter = require("./routes/ApplicationRoutes");
const path = require("path");
const server = express();

const _dirname = path.resolve();
const corsOptions = {
  origin: ["http://localhost:5173", "https://jobfusion.netlify.app/"],
  credentials: true,
};
//middle wares
dotenv.config({});
server.use(cors(corsOptions));
server.use(express.urlencoded({ extended: true }));
server.use(cookieparser());
server.use(express.json());

const PORT = process.env.PORT || 3000;

// api
server.use("/api/v1/application", applicationRouter);
server.use("/api/v1/job", jobRouter);
server.use("/api/v1/company", companyRouter);
server.use("/api/v1/user", userRouter);
server.get("/test", (req, res) => {
  res.status(200).json("test route shown correctly");
});
// server.use(express.static(path.join(_dirname, "frontend/dist")));
// server.get("*", (_, res) => {
//   res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
// });

server.listen(PORT, async () => {
  await dbConnectModule.connectDb();
  console.log(`server running on port ${PORT}`);
});
