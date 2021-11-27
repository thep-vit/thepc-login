const User = require("../models/User");

exports.toggleAccess = async (req, res) => {
    const { id } = req.params;

    const foundUser = await User.findOne({_id: id});
    foundUser.isDisabled = !foundUser.isDisabled;

    await foundUser.save();

    res.status(200).send({'message': `User account with email ${foundUser.email} isDisabled param set to ${foundUser.isDisabled}.`});
}