const express = require("express");
const print = require("colorprint-js");
const cors = require("cors");
const dataRoute = require("./routes");
const morgan = require("morgan")

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(express.static("src/public"));
app.use(morgan(`dev`))
app.use(dataRoute);

app.listen(PORT, () =>
	print.bCyan(`server is running on http://localhost:${PORT}`),
);
