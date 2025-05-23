const Testimonial = require('../../models/testimonial');

// POST: Add testimonial with duplicate check
const addTestimonial = async (req, res) => {
  try {
    const { name, role, feedback } = req.body;

    // Check for duplicate by name and feedback
    const existing = await Testimonial.findOne({ name, feedback });
    if (existing) {
      return res.status(409).json({ error: "Duplicate testimonial. This feedback already exists." });
    }

    const newTestimonial = new Testimonial({ name, role, feedback });
    await newTestimonial.save();
    res.status(201).json({ success: true, message: "Testimonial submitted successfully!" });
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET: Fetch testimonials
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
};

module.exports = { addTestimonial, getTestimonials };
