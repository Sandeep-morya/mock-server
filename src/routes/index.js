const e = require("express");
const express = require("express");
const fs = require("fs");
const dynamicRoute = express.Router();

dynamicRoute.post("/:key", (req, res) => {
	const data = JSON.parse(fs.readFileSync("db.json", "utf-8"));
	const list = data[req.params.key];
	if (list) {
		const entry = { id: list.length + 1, ...req.body };
		list.push(entry);
		data[req.params.key] = list.map((e, i) => ({ ...e, id: i + 1 }));
		fs.writeFileSync("db.json", JSON.stringify(data));

		res.status(201).send(entry);
	} else {
		res.status(400).send("Invalid Key");
	}
});

dynamicRoute.patch("/:key/:id", (req, res) => {
	const data = JSON.parse(fs.readFileSync("db.json", "utf-8"));
	const list = data[req.params.key];
	const _id = Number(req.params.id);
	if (_id && list[_id - 1]) {
		data[req.params.key] = list.map((item) =>
			item.id === _id ? { ...item, ...req.body } : item,
		);
		fs.writeFileSync("db.json", JSON.stringify(data));

		res.status(201).send({ id: _id, ...list[_id - 1], ...req.body });
	} else {
		res.status(404).send();
	}
});

dynamicRoute.put("/:key/:id", (req, res) => {
	const data = JSON.parse(fs.readFileSync("db.json", "utf-8"));
	const list = data[req.params.key];
	const _id = Number(req.params.id);
	if (_id && list[_id - 1]) {
		data[req.params.key] = list.map((item) =>
			item.id === _id ? { id: item.id, ...req.body } : item,
		);
		fs.writeFileSync("db.json", JSON.stringify(data));

		res.status(201).send({ id: _id, ...list[_id - 1], ...req.body });
	} else {
		res.status(404).send();
	}
});

dynamicRoute.delete("/:key/:id", (req, res) => {
	const data = JSON.parse(fs.readFileSync("db.json", "utf-8"));
	const list = data[req.params.key];
	const _id = Number(req.params.id);
	if (_id && list[_id - 1]) {
		const target = list[_id - 1];
		console.log(target);
		const new_list = list.filter((item) => item.id !== _id);
		data[req.params.key] = new_list.map((e, i) => ({ ...e, id: i + 1 }));
		fs.writeFileSync("db.json", JSON.stringify(data));
		res.status(200).json(target);
	} else {
		res.status(404).send();
	}
});

dynamicRoute.get("/:key", (req, res) => {
	const data = JSON.parse(fs.readFileSync("db.json", "utf-8"));
	const list = data[req.params.key];
	const page = req?.query?.page;
	const temp_limit = req?.query?.limit || 10;

	if (list) {
		if (!page) {
			res.status(200);
			res.json({ data: list, total_count: list.length });
		} else {
			const limit = temp_limit > list.length ? list.length : temp_limit;

			const start = page * limit - limit;
			const end = page * limit;
			const current = list.slice(start, end);
			// res.status(200).json(current)
			res.json({
				data: current,
				total_count: current.length,
				total_pages: Math.ceil(list.length / limit),
			});
		}
	} else {
		res.status(404).send();
	}
});

dynamicRoute.get("/:key/:id", (req, res) => {
	const data = JSON.parse(fs.readFileSync("db.json", "utf-8"));
	const list = data[req.params.key];
	const _id = Number(req.params.id);

	if (list && _id && list[_id - 1]) {
		res.status(200).send({ data: list[_id - 1], total_count: 1 });
	} else {
		res.status(404).send();
	}
});

module.exports = dynamicRoute;
