import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: "dmshh12@gmail.com",
    pass: "jbgf roou nvjn mdxn",
  },
});

async function senderMail(to: string, subject: string, text: string) {
    
    try {
    await transporter.sendMail({
        from: "dmshh12@gmail.com",
        to,
        subject,
        text, 
        // html: "<b>Hello world?</b>",
    });
    // console.log('INFO', info);
    

    return {meesage: "email was send", }
    } catch (error) {
        console.log(error);
        throw error
    }
    
}

export default senderMail