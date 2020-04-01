const nodemailer=require('nodemailer')
const dotenv=require('dotenv')
dotenv.config()

let transport=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    debug:process.env.NODE_ENV ==="develop",
    auth:{
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS
    }
})


 let verify=async ()=>{
    try{
       let status = await transport.verify()
       await console.log(status) //true is printing don't know why should be removed?????
    } catch (err) {
       console.log(err)                  
    }
 }
 verify();

 let send_mail=async (email,subject,html)=>{
    let status = await transport.sendMail({
       from:`ShubhKadam.com`, 
       to:email,
       subject:subject,
       html:html
    })
    try {
      //  console.log(status)                  
    } catch (err) {
       console.log(err)
    }
 }

 module.exports = send_mail