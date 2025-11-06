import express from "express";
const router = express.Router();

router.get("/send",(req,res)=>{
    res.send("message is sended")
});



export default router;