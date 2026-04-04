
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({     //smtp serer se communicate karne ke liye
//   service: 'gmail',
//   auth: {
//     type: 'OAuth2',
//     user: process.env.EMAIL_USER,
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     refreshToken: process.env.REFRESH_TOKEN,
//   },
// });

// // Verify the connection configuration
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('Error connecting to email server:', error);
//   } else {
//     console.log('Email server is ready to send messages');
//   }
// });

// // Function to send email
// const sendEmail = async (to, subject, text, html) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"Bank Project" <${process.env.EMAIL_USER}>`, // sender address
//       to, // list of receivers
//       subject, // Subject line
//       text, // plain text body
//       html, // html body
//     });

//     console.log('Message sent: %s', info.messageId);
//     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };


//  async function sendRegistrationEmail(userEmail ,name){
//     const subject =`welcome to Bank project!` ;
 
//     const text =`Hello ${name},\n\nThank you for registering at Backend project. We are excited to have you on board !\n\nBbest regard,\nThe Backend project Team`;
//     const html=`<p>Hello ${name},</p><p>Thanks you for registering at Bank project .we are excited to have you  on board!</p><p>Best regards,<b>The Bank project Team</p>`;

//     await sendEmail(userEmail, subject ,text ,html);
// }
// async function sendTransactionEmail(userEmail, name, amount, toaccount) {
//     const subject = `Transaction Successful - Bank Project`;

//     const text = `Hello ${name},\n\nYour transaction of $${amount} to account ${toaccount} was successful.\nThank you for using Bank Project.\n\nBest regards,\nThe Bank Project Team`;

//     const html = `
//         <p>Hello ${name},</p>
//         <p>Your transaction of <b>$${amount}</b> to account <b>${toaccount}</b> was <span style="color:green;">successful</span>.</p>
//         <p>Thank you for using Bank Project.</p>
//         <p>Best regards,<br><b>The Bank Project Team</b></p>
//     `;

//     await sendEmail(userEmail, subject, text, html);
// }


// async function sendTransactionFailureEmail(userEmail, name, amount, toaccount) {
//     const subject = `Transaction Failed - Bank Project`;

//     const text = `Hello ${name},\n\nYour transaction of $${amount} to account ${toaccount} has failed.\nPlease try again or contact support.\n\nBest regards,\nThe Bank Project Team`;

//     const html = `
//         <p>Hello ${name},</p>
//         <p>Your transaction of <b>$${amount}</b> to account <b>${toaccount}</b> has <span style="color:red;">failed</span>.</p>
//         <p>Please try again or contact our support team for assistance.</p>
//         <p>Best regards,<br><b>The Bank Project Team</b></p>
//     `;

//     await sendEmail(userEmail, subject, text, html);
// }


// module.exports = {
//     sendRegistrationEmail,
//     sendTransactionFailureEmail,  // function ka actual naam
//     sendTransactionEmail
// }


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