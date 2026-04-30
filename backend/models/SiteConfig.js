const mongoose = require("mongoose");

const buttonSchema = new mongoose.Schema({
  text: { type: String, required: true },
  link: { type: String, required: true },
  primary: { type: Boolean, default: false }
});

const heroSlideSchema = new mongoose.Schema({
  subtitle: { type: String },
  title: [{ type: String }],
  description: { type: String },
  image: { type: String, required: true },
  buttons: [buttonSchema]
});

const siteConfigSchema = new mongoose.Schema({
  heroSlides: [heroSlideSchema]
}, { timestamps: true });

const SiteConfig = mongoose.model("SiteConfig", siteConfigSchema);

module.exports = SiteConfig;
