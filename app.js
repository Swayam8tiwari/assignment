const nodemailer = require('nodemailer');
const { google } = require('googleapis');  
const express = require('express') //using express
const app= express();
const OAuth2Data=require('./credentials.json')
const fs = require('fs');  
const filecontent= fs.readFileSync('assignment9aug.html') 
const hostname='127.0.0.1'; 
const port= 3000;  
// These id's and secrets should come from credential.json file.
const CLIENT_ID = OAuth2Data.web.client_id;
const CLEINT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URI = OAuth2Data.web.redirect_uris;
const REFRESH_TOKEN = '1//04h4br4r8y84aCgYIARAAGAQSNwF-L9IrK2OZIkIe1dx9HnnXPEt7I5bSrkRG0oyv-m-VD25NPNUAjxhvZLZKilucjq2y4a42si4';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


 
 

app.use(express.urlencoded({ extended: true}));
app.get('/',(req,res)=>{
res.end(filecontent);//rendering html file for interface
});
app.post('/submit',(req,res)=>{ 
//processing input data

let data1=JSON.stringify(req.body.from);
let data2=JSON.stringify(req.body.to); 
let data3=JSON.stringify(req.body.subbody); 
let data4=JSON.stringify(req.body.body);

async function sendMail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'swayamtiwari097@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      }, 
    });

    const mailOptions = {
      from: data1,
      to: data2,
      subject: data3,
      text: data4,
      html: '<h1>Hello from gmail email using API</h1>',
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

sendMail()
  .then((result) => console.log('Email sent...', result))
  .catch((error) => console.log(error.message)); 
} 

)
app.listen(port,hostname,()=>{

    console.log('running');
});
