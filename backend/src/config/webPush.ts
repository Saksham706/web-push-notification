import webPush from "web-push";
import dotenv  from "dotenv";

dotenv.config();

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT;

if(!publicKey || !privateKey || !subject){
          throw new Error(
                    "Missing VAPID configuration"
          )
}

webPush.setVapidDetails(subject, publicKey, privateKey);
export default webPush;