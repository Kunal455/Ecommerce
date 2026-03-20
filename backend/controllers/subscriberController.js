const Subscriber = require("../models/Subscriber");

// @desc Subscribe to newsletter
// @route POST /api/v3/subscribe
// @access Public

const subscribeUser = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    // Check if already subscribed
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return res.status(400).json({
        message: "Email is already subscribed"
      });
    }

    // Create subscriber
    subscriber = new Subscriber({ email });

    await subscriber.save();

    res.status(201).json({
      success: true,
      message: "Successfully subscribed"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

module.exports = { subscribeUser };