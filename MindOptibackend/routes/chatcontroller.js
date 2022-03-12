const pool = require("../db");


//send message
const sendMessage = async (req,res)=>{
    // const {messageBody,senderid } =req.body;
    const sid = req.params.sid;
    const tid = req.params.tid;
        pool.query("INSERT INTO chat (StudentID,TeacherID,ChatTime) values ($1,$2,CURRENT_TIMESTAMP)",[sid,tid],)
        // pool.query("INSERT INTO Message_ (MessageBody,sender) values ($1,$2)",[messageBody,senderid],)
}


//delete message
const deleteMsg= async(req,res) => {
    const id=req.params.id;
  
            pool.query("DELETE FROM Message_ WHERE msgcode=$1 ",[id],(error,results)=>{
                if(error)throw error;
                res.status(201).send("Message Deleted");
            });
        }

   

module.exports = {
    sendMessage,
    deleteMsg
    
};