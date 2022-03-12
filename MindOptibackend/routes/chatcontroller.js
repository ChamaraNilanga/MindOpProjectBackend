const pool = require("../db");


//send message
const sendMessage = async (req,res)=>{
    const {messageBody} =req.body;
    const sid = req.params.sid;
    const rid = req.params.tid;
      await pool.query("INSERT INTO message_ (messagebody,sender) values ($1,$2)",[messageBody,sid],),(error,results)=>{
            if (results.rows.length){

                 pool.query("SELECT messageid FROM message_ WHERE sender=$1 AND messagebody=$2",[sid,messageBody],(error,results) => {
                    if (results.rows.length){
                               const mid= results;
                               pool.query("INSERT INTO chat (senderid,receiverid,chattime,messageid) values ($1,$2,CURRENT_TIMESTAMP,$3)",[sid,rid,mid],(error,results) => {
                                   if(error) throw error;
                                   res.status(200).send("insert message");
                               });
                  }  })

                  
        };
    }

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