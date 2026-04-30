

const nodemailer = require('nodemailer');

// ✅ Email temporarily disable करो
const transporter = {
    verify: (callback) => callback(null, true)
};

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.log('⚠️  Email disabled (for testing)');
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        console.log(`📧 [DISABLED] Email would be sent to: ${to}`);
        console.log(`   Subject: ${subject}`);
        return { messageId: 'disabled' };
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

async function sendRegistrationEmail(userEmail, name) {
    const subject = `Welcome to Bank project!`;
    const text = `Hello ${name},\n\nThank you for registering at Bank project!`;
    const html = `<p>Hello ${name},</p><p>Thank you for registering!</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toaccount) {
    const subject = `Transaction Successful - Bank Project`;
    const text = `Hello ${name},\n\nYour transaction of $${amount} was successful.`;
    const html = `<p>Hello ${name},</p><p>Your transaction of <b>$${amount}</b> was successful.</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toaccount) {
    const subject = `Transaction Failed - Bank Project`;
    const text = `Hello ${name},\n\nYour transaction of $${amount} has failed.`;
    const html = `<p>Hello ${name},</p><p>Your transaction of <b>$${amount}</b> has failed.</p>`;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionFailureEmail,
    sendTransactionEmail
};