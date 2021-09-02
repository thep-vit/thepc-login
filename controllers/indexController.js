exports.landing = (req, res) => {
    res.status(200).render('index.ejs');
}

exports.userLogin = (req, res) => {
    const { email, password } = req.body;

    res.status(200).send({user: "foudnUSer"});
}

exports.userSignUp = (req, res) => {
    const { name, email, password, dept } = req.body;

    res.status(200).send({user: "foudnUSer"});
}