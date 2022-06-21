require('dotenv').config();

//const upload =multer({dest:"uploads/"});
const S3=require("aws-sdk/clients/s3");
const  uuid=require("uuid");
const fs=require("fs");

const bucketname=process.env.AWS_BUCKET_NAME;
const region=process.env.AWS_BUCKET_REGION;
const accessKeyId=process.env.AWS_ACCESS_KEY;
const secretAccessKey=process.env.AWS_SECRET_KEY;

const s3=new S3({
    region,
    accessKeyId,
    secretAccessKey
});

function uploadFile(file){
    const fileStream = fs.createReadStream(file.path);
    const uploadParams={
        Bucket:bucketname,
        Body:fileStream,
        Key:file.filename
    }
    return s3.upload(uploadParams).promise();
}
exports.uploadFile=uploadFile;

// downloads a file from s3
function getFileStream(fileKey) {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketname
    }
  
    return s3.getObject(downloadParams).createReadStream()
  }
  exports.getFileStream = getFileStream;
