var express=require('express');
var server = express();
var cors = require('cors');
var mysql=require('mysql');
var bodyParser=require('body-parser');
var fileupload = require("express-fileupload");
// var util = require("util");
// var multer = require('multer');
var fs=require('fs');
var conn=require('./mailOtp');
csv=require('csvtojson');
server.use(cors())
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());
server.use(fileupload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
console.log(__dirname);
server.use(express.static(__dirname + '/public'));
server.set('views', __dirname + '/views');
server.engine('html', require('ejs').renderFile);
server.set('view engine', 'html');





server.get("/",function(req,res){
    console.log("into post");
    // res.setHeader('Content-Type', 'text/html');
res.redirect("index.html");





});
server.get("/GetcsvData",function(req,res){
    var con=conn.getDataBaseConnection(mysql);
    var getCsvData="select * from usercsvdata";
    con.query(getCsvData,function (err, result,fields) {
        if (err) throw err;
console.log(result);
res.send(result)
        //
        //
    });

});

server.post("/fileupload",function(req,res){
    console.log("upload")
    var fstream;
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    var sampleFile = req.files.fileToUpload;
    console.log(req.files.fileToUpload.name);
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(__dirname +'/public/'+ req.files.fileToUpload.name, function(err) {
        if (err)
console.log(err)
    });

    csv().fromFile(__dirname +'/public/'+ req.files.fileToUpload.name)

        .on('json',function(jsonObj) {
            var con=conn.getDataBaseConnection(mysql);
// console.log(jsonObj);
            var keys = Object.keys(jsonObj);
            // console.log(keys.length)
            // for (var i = 0; i < keys.length; i++) {


                var insertcsvdatabase="insert into usercsvdata(firstname,lastname,contact,address) value('"+jsonObj[keys[0]]+"','"+jsonObj[keys[1]]+"','"+jsonObj[keys[2]]+"','"+jsonObj[keys[3]]+"')";
                con.query(insertcsvdatabase,function (err, result,fields) {
                    if (err) throw err;

                    //
                    //
                });
        // }
    })
.on('done',function(error){
    console.log("done");
    res.render('display.html');
});



});


server.listen(2224);
console.log("server listening on 2224");


