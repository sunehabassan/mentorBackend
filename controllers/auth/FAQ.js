// controllers/faqController.js
const Contact = require("../../models/contact");

// Controller to submit a new FAQ
const submitFaq = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newFaq = new Contact({
      name,
      email,
      message,
    });

    await newFaq.save();

    res.status(201).json({ success: true, message: "FAQ submitted successfully!" });
  } catch (error) {
    console.error("Error in submitting FAQ:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Controller to fetch all answered FAQs
const getAnsweredFaqs = async (req, res) => {
  try {
    const faqs = await Contact.find({ answer: { $ne: "" } }).sort({ createdAt: -1 });
    res.status(200).json(faqs);
  } catch (error) {
    console.error("Error fetching answered FAQs:", error);
    res.status(500).json({ error: "Failed to fetch answered FAQs" });
  }
};

// Controller to update the answer to an FAQ
const updateFaqAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    const faq = await Contact.findByIdAndUpdate(id, { answer }, { new: true });

    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    res.status(200).json({ success: true, message: "FAQ answer updated", faq });
  } catch (error) {
    console.error("Error updating FAQ answer:", error);
    res.status(500).json({ error: "Error updating FAQ answer" });
  }
};

module.exports = { submitFaq, getAnsweredFaqs, updateFaqAnswer };
