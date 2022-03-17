const pool = require("../db");


//send message
const sendMessage =async(req,res)=>{
    const messageBody =req.body;
    const sid = req.params.sid;
    const rid = req.params.rid;
    await pool.query("INSERT INTO chat (senderid,receiverid,chattime,messagebody) VALUES ($1,$2,CURRENT_TIMESTAMP,$3)",[sid,rid,messageBody],(error,results)=>{
        if(error) throw error;
        res.status(200).send("Successfully send a message");
    });
};


//delete message
const deleteMessage= async(req,res) => {
const cid=req.params.cid;
await pool.query("SELECT chatid FROM chat WHERE chatid=$1 ",[cid],(error,results)=>{
    if (!results.rows.length){
        res.send("There is no any messsage for this id");
    }else{
        pool.query("DELETE FROM chat WHERE chatid=$1 ",[cid],(error,results)=>{
            if(error)throw error;
            res.status(201).send("Message Deleted");
        });
    }

});

};



// get message
const getMessage = async(req,res) => {
const sid=req.params.sid;
const rid=req.params.rid;

await pool.query("SELECT chatid,senderid,receiverid,chattime,MessageBody FROM chat WHERE senderid=$1 AND receiverid=$2 OR senderid=$2 AND receiverid=$1",[sid,rid],(error,results)=>{
    if (error) throw  error;
    res.status(200).json(results.rows);
});
};


module.exports = {
sendMessage,
deleteMessage,
getMessage

};