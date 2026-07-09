import sgMail from "@sendgrid/mail"
import "dotenv/config";

sgMail.setApiKey(String(process.env.SENDGRID_API_KEY))

export async function sendMail(to:string,subject:string,text:string){
    try{
        const message = {
            to,
            from: String(process.env.MY_MAIL),
            subject,
            text,
            html: `<p>${text}</p>`,
        }

        const res = await sgMail.send(message)

        console.log("mail sent")
        return res
    }
    catch(err:any){
        console.log(err.message)
    }
}