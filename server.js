const express=require('express');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let config = require('./config');
let middleware=require('./middleware');
let app=require('./connection1.js');
class HandlerGenerator{
    login(req,res){
        let username=req.body.username;
        let password=req.body.password;
        //for the given username fetch user form db
        let mockedusername='admin';
        let mockedpassword='password';
        if(username && password){
            if(username===mockedusername && password===mockedpassword){
                let token=jwt.sign({username : username},
                    config.secret,
                    {
                        expiresIn:'24h' 
                    }
                    );
                    res.json({
                        success:true,
                        message:'Authentication successful',
                        token: token,
                    });
            }
            else{
                res.json({
                    success:false,
                    message:'Incorrect username or password',
                });
            }
        }
            else{
                res.json({
                    success:false,
                    message:'Authentication failed please check the request',
                });
            }
        }
        testFunction(req,res){
            res.json({
                success:true,
                message:'Testing Successful',
            });
        }
    }
 //starting point of the server   
    function main(){
        let app=express();  //export app
        let handlers=new HandlerGenerator(); //object of class
        const port =100;
        app.use(bodyParser.urlencoded({  //middleware
            extended:true,
        }));
        app.use(bodyParser.json());
        app.post('/login',handlers.login);
        app.get('/,middleware.checkToken,handlers.testFunction');
        app.listen(port,()=>console.log(`Server is listening on port: ${port}`));
    }
    
    main();


