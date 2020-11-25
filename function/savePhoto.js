const Jimp = require('jimp')
const fs = require('fs')
const aws = require('aws-sdk')
const keys = require('../keys')

aws.config.update({
    "accessKeyId": keys.AWS_ACCESS_KEY_ID,
    "secretAccessKey": keys.AWS_SECRET_ACCESS_KEY,
    "region": 'us-east-2'
});
let s3 = new aws.S3({
    apiVersion: "2006-03-01",
    params: {Bucket: keys.S3_BUCKET}
})

module.exports = function savePhoto(el) {
    console.log(el.size)
    fs.readFile(el.path, function (err, data) {
        if (err) throw err;
        if (el.mimetype === 'image/webp') {
            const params = {
                Bucket: 'zodaikapp',
                Key: el.filename,
                Body: data,
                ContentType: el.mimetype,
                ACL: 'public-read'
            }
            s3.putObject(params, function (err, data) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Successfully uploaded data to myBucket/myKey", data);
                }
            })
        } else {
            Jimp.read(Buffer.from(data, 'base64'))
                .then(async data => {
                    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
                    data.print(
                        font,
                        data.bitmap.width / 2,
                        data.bitmap.height / 2.4,
                        {
                            text: 'ZODIAK',
                            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
                        },
                        10,
                        10
                    )
                    return data.getBufferAsync(Jimp.AUTO)
                }).then(buffer => {
                const params = {
                    Bucket: keys.S3_BUCKET,
                    Key: el.filename,
                    Body: buffer,
                    ContentType: el.mimetype,
                    ACL: 'public-read'
                };
                s3.putObject(params, function (err, data) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Successfully uploaded data to myBucket/myKey", data);
                    }
                })
            })
        }
    });
return true
}
