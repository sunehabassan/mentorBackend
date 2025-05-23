const Contact = require("../../models/contact");


const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    res.status(201).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact submission error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

module.exports = { submitContactForm };
