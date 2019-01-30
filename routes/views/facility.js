module.exports = (req, res) => {
	res.render("facility/" + req.params.name);
}
