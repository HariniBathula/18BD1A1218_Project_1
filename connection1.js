const express= require('express');
const app=express();

//bodyparser
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//for mongodb
const MongoClient=require('mongodb').MongoClient;

//connecting server file
let server = require('./server');
let config=require('./config');
let middleware=require('./middleware');
const response=require('express');

//database connection
const url='mongodb://127.0.0.1:27017';
const dbName='HospitalManagement';
let db

MongoClient.connect(url, {useUnifiedTopology:true},(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
})
//FETCHING HOSPITAL DETAILS
app.get('/hospitaldetails',middleware.checkToken,function(req,res){
    console.log("fetching data from hospital collection");
    var data=db.collection('hospitaldetails').find().toArray().then(result =>res.json(result));
})
//VENTILATOR DETAILS
app.get('/ventilatordetails',middleware.checkToken,(req,res)=>{
    console.log("ventilator information");
    var ventilatordetails=db.collection('ventilatordetails').find().toArray().then(result=>res.json(result));
})
//SEARCH VENTILATOR BY STATUS
app.post('/searchventilatorbystatus',middleware.checkToken,(req,res)=>{
    var status=req.body.status;
    console.log(status);
    var ventilatordetails=db.collection('ventilatordetails')
    .find({"status":status}).toArray().then(result=>res.json(result));
})
//SEARCH VENTILATOR BY HOSPITAL NAME
app.post('/searchventilatorbyname',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var ventilatordetails=db.collection('ventilatordetails')
    .find({'name':new RegExp(name,'i')}).toArray().then(result=>res.json(result));
})
//SEARCH HOSPITAL BY NAME
app.post('/searchhospital',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var hospitaldetails=db.collection('hospitaldetails')
    .find({'name':new RegExp(name,'i')}).toArray().then(result=>res.json(result));
});
//UPDATE VENTILATOR DETAILS
app.put('/updateventilator',middleware.checkToken,(req,res)=>{
    var ventid={ventilatorid:req.body.ventilatorid};
    console.log(ventid);
    var newvalues={$set:{status:req.body.status}};
    db.collection("ventilatordetails").updateOne(ventid,newvalues,function(err,result){
        res.json('1 document updated');
        if(err) throw err;
        console.log('1 doc updated');
    });
});
//ADD VENTILATOR 
app.post('/addventilatorbyuser',middleware.checkToken,(req,res)=>{
    var hid=req.body.hid;
    var ventilatorid=req.body.ventilatorid;
    var status=req.body.status;
    var name=req.body.name;
    var item=
    {
        hid:hid,ventilatorid:ventilatorid,status:status,name:name
    };
    db.collection('ventilatordetails').insertOne(item,function(err,result){
        res.json('item inserted');
        console.log('added ventilator');
    });
});
//DELETE VENTILATOR BY VENTILATORID
app.delete('/delete',middleware.checkToken,(req,res)=>{
    var myquery=req.query.ventilatorid;
    console.log(myquery);
    var myquery1={ventilatorid:myquery};
    db.collection('ventilatordetails').deleteOne(myquery1,function(err,obj){
        if(err) throw err;
        res.json("1 document deleted")
        console.log("1 doc deleted");
    });
})
app.listen("1100");





