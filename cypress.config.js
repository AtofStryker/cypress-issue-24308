// starts the SMTP mailer server at localhost:7777
const port = 7777;
const mailServer = ms.init(port);
console.log("mail server at port %d", port);

// [receiver email]: email text
let lastEmail = {};

// process all emails
mailServer.bind((addr, id, email) => {
  console.log("--- email to %s ---", email.headers.to);
  console.log(email.body);
  console.log("--- end ---");
  // store the email by the receiver email
  // @ts-ignore
  lastEmail[email.headers.to] = email.html || email.body;
});

on("task", {
  getUserEmail() {
    return emailAddress;
  },

  getLastEmail() {
    return emailAccount.getLastEmail();
  },
});

on("task", {
  sendEmail() {
    // async await is not allowed in global scope, must use a wrapper
    async function main() {
      // create reusable transporter object using the default SMTP transport
      // the settings could come from .env file or environment variables
      const transporter = nodemailer.createTransport({
        host: "localhost",
        port: 7777,
        secure: false, // true for 465, false for other ports
      });

      // send an email
      const info = await transporter.sendMail({
        from: '"Fred Blogger" <freg@blogger.com>',
        to: emailAddress, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });

      console.log("Message sent: %s", info.messageId);
    }

    main().catch(console.error);
    return null;
  },
});
