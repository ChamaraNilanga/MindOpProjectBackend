const express = require('express')
const pool = require('./db.js')

const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const { uploadFile, getFileStream } = require('./s3')

const app = express()

app.get('/images/:key', (req, res) => {

  console.log(req.params)
  const key = req.params.key
  const readStream = getFileStream(key)

  readStream.pipe(res)
})

app.post('/images', upload.single('image'), async (req, res) => {
  const file = req.file
  console.log(file)

  // apply filter
  // resize 

  const result = await uploadFile(file)
  // await unlinkFile(file.path)
  console.log(result)
  const {description,type,modeid}= req.body
  // res.send({imagePath: `/images/${result.Key}`})
  if(result){
    const image=result.Key;
    pool.query("INSERT INTO content (typeid,uploadtime,moduleid,url) VALUES ($1,CURRENT_TIMESTAMP,$2,$3)",[type,modeid,image],(error,results)=>{
        if(error) throw error;
        res.status(200).send("successfully uploaded and database updated");
    
    });
}else{
    res.status(400).send("uploading unsuccessfull");
}

})


app.get('/images', (req, res) => {
  pool.query("SELECT url FROM content ORDER BY contentid DESC limit 1",(error,results)=>{
    if(results){
      res.send(results.rows);
    }
    
   
   
  })});




app.listen(8080, () => console.log("listening on port 8080"))