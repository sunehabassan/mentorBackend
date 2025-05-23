const Contact = require("../../models/contact");

// Submit Contact/FAQ Message
const submitMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    res.status(201).json({ success: true, message: "Message submitted successfully!" });
  } catch (error) {
    console.error("Error submitting message:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Get Answered FAQs Only
const getAnsweredFaqs = async (req, res) => {
  try {
    const faqs = await Contact.find({ answer: { $ne: "" } }).sort({ createdAt: -1 });
    res.status(200).json(faqs);
  } catch (error) {
    console.error("Error fetching answered FAQs:", error);
    res.status(500).json({ error: "Failed to fetch answered FAQs" });
  }
};

// Admin: Update FAQ Answer
const updateFaqAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    const faq = await Contact.findByIdAndUpdate(id, { answer }, { new: true });

    if (!faq) return res.status(404).json({ error: "FAQ not found" });

    res.status(200).json({ success: true, message: "FAQ answer updated", faq });
  } catch (error) {
    console.error("Error updating FAQ answer:", error);
    res.status(500).json({ error: "Error updating FAQ answer" });
  }
};
// Get Single FAQ by ID
const getFaqById = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await Contact.findById(id);

    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    res.status(200).json(faq);
  } catch (error) {
    console.error("Error fetching FAQ by ID:", error);
    res.status(500).json({ error: "Error fetching FAQ" });
  }
};

// Get All Submitted Messages (Admin View)
const getAllFaqs = async (req, res) => {
  try {
    const faqs = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(faqs);
  } catch (error) {
    console.error("Error fetching all FAQs:", error);
    res.status(500).json({ error: "Failed to fetch all FAQs" });
  }
};

module.exports = {
  submitMessage,
  getAnsweredFaqs,
  updateFaqAnswer,
  getFaqById,getAllFaqs
};
