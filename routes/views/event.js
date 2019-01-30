module.exports = (req, res) => {
	res.render("event/" + req.params.name);
}

