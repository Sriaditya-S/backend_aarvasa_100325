const transporter = require('../config/nodemailer'); // Nodemailer configuration

/**
 * Sends a consultation email.
 */
exports.sendConsultation = async (req, res) => {
  try {
    const { name, email, date } = req.body;

    const mailOptions = {
      to: 'theaarvasa@gmail.com',
      subject: 'Consultation Request',
      text: `Hi, I want to consult Aarvasa. My name is ${name}, my email is ${email}, and the date of consultation is ${date}.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Consultation email sent successfully' });
  } catch (error) {
    console.error('Error sending consultation email:', error);
    res.status(500).json({ message: 'Failed to send consultation email', error: error.message });
  }
};