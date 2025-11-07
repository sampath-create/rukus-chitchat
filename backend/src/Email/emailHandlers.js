import {resendClient,sender} from "../lib/resend.js";
import {createWelcomeEmailTemplate} from "./emailTempletes.js";

export const sendWelcomeEmail = async (email,name,clienturl) =>{
    const {data,error} = await resendClient.emails.send({
        from : `${sender.name} <${sender.email}>`,
        to :email,
        subject : "Welcome to rukus chat application",
        html : createWelcomeEmailTemplate(name,clienturl)
    })
     if (error){
        console.log("Error sending welcome email:",error);
        throw new Error ("Failed to send welcome email");
     }
     console.log("Welcome email sent successfully to ",data);
};