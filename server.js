const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

/* routs: */
const accountRouter = require("./routes/user");
const loginRouter = require("./routes/login");
const todoRouter = require("./routes/todosRouters/todoRouter");
const listsRouter = require("./routes/todosRouters/listsRouter");
const postsRouter = require("./routes/postsRouter");
const imgsRouter = require("./routes/imgsRoute");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/project-rest-api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connected to mongo");
  })
  .catch((error) => {
    console.error("Connection to mongo Failed");
    console.error(error.message);
  });

app.use(morgan("dev"));

// app.use(express.static(__dirname + "./MyT-project/build"));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "./MyT-project/build/index.html"));
// });

app.use("/api/users", accountRouter);
app.use("/api/login", loginRouter);
app.use("/api/image", imgsRouter);
app.use("/api/posts", postsRouter);
app.use("/api/todoList/lists", listsRouter);
app.use("/api/todoList/todos", todoRouter);

app.get("/public/img/uploads/:filename", async (req, res) => {
  await res.sendFile(req.params.filename, {
    root: path.join(__dirname, "/public/img/uploads"),
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("MyT-project/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join("MyT-project/build/index.html"));
  });
} else {
}

const _PORT = process.env.PORT || 8181;
app.listen(_PORT, () => console.log(`connected to port : ${_PORT}`));
