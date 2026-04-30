const SiteConfig = require("../models/SiteConfig");

// @route   GET /api/v3/config
// @desc    Get the site configuration
// @access  Public
const getConfig = async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      // Return a 404 or empty config so frontend can use defaults
      return res.status(404).json({ message: "Config not found" });
    }
    res.json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @route   PUT /api/v3/config/hero
// @desc    Update hero slides configuration
// @access  Private/Admin
const updateHeroSlides = async (req, res) => {
  try {
    const { heroSlides } = req.body;
    
    let config = await SiteConfig.findOne();
    
    if (!config) {
      config = new SiteConfig({ heroSlides });
    } else {
      config.heroSlides = heroSlides;
    }

    const updatedConfig = await config.save();
    res.json(updatedConfig);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getConfig, updateHeroSlides };
