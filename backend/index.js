const express = require("express");
const cors = require("cors");
const mongoose=require("mongoose");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://jayanthi:20052002@cluster0.iqvsene.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function(){
    console.log("Connected to db")
}).catch(function(){
    console.log("Failed to connect")
})

const credential=mongoose.model("credential",{},"bulkmail")

app.post("/sendmail", function (req, res) {
    var msg = req.body.msg;
    var emaillist = req.body.emaillist;
    
    credential.find().then(function(data){
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: data[0].toJSON().user,
            pass: data[0].toJSON().pass,
        },
    });
    new Promise(async function(resolve,reject){
        try {
            for (var i = 0; i < emaillist.length; i++) {
                await transporter.sendMail({
                    from: "rjayanthi205@gmail.com",
                    to: emaillist[i],
                    subject: "A message from Bulk Mail App",
                    text: msg
                }
                )
                console.log("Email sent to:"+emaillist[i])
            }
         resolve("Success")
        }
        catch(error){
            reject("Failed")
        }
    }).then(function(){
    res.send(true)
    }).catch(function(){
    res.send(false)
    })
     

}).catch(function(error){
    console.log(error)
})
    

})


app.listen(5000, function () {
    console.log("server started...");
})