import express from "express"
import {a} from "@repo/backend_things/config"
const app= express();

app.get("/",(req:express.Request,res:express.Response)=>{
    console.log("first ",a);
    res.send("Hii ");
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})