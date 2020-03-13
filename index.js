// implement your API here
const express = require('express');
const db = require('./data/db.js')
const server = express();
const shortid = require("shortid")

server.listen(4000, ()=>{

    console.log("listen on port 4000...");
})

server.use(express.json());//MIDDLEWARE

//HTTP METHOD
//URI: scheme://host_name:port/path?parameter_list
//https://www.google.com/some/document?with_params=value

// server.get('/', (req, res)=>{
//     res.send('hello world!');
// });

// server.get('/hey', (req, res)=>{
//     res.send('Hi There!');
// });

//R -Read
server.get('/api/users', (req, res) => {
    db.find()
        .then(users =>{
            res.status(200).json({users});
        })
        .catch(err => {
            res.status(500).json({success: false, errorMessage: 'Users info could not be retrieved', err});
        })
})

//C - Post
server.post('/api/users', (req, res)=>{
    const {name, bio} = req.body
    !name || !bio 
    ? res.status(400).json({success: false, errorMessage: "Please provide name and bio for the user."})
    : db

    .insert(req.body)
        .then(user =>{
            res.status(201).json(user);
        })
        .catch(err =>{
            res
              .status(500)
              .json({
                success: false,
                errorMessage:
                  "There was an error while saving the user to the database", err
              });
        })
})

//U - Update
server.put('/api/users/:id', (req,res)=>{
    const {id} = req.params;
    const {name, bio} = req.body;
    //let index = users.findIndex(user => user.id === id);

     !name || !bio
       ? res.status(400).json({
           success: false,
           errorMessage: "Please provide name and bio for the user"
         })
       : db
           .update(id, req.body)

           .then(item => {
             if (item) {
               res.status(200).json(req.body);
             } else {
               res.status(404).json({
                 success: false,
                 errorMessage: "The user with the specified ID does not exist"
               });
             }
           })
           .catch(err =>
             res.status(500).json({
               success: false,
               errorMessage: "The user information could not be modified.",
               err
             })
           );
})
//R - Read by ID
 server.get('/api/users/:id', (req, res) =>{
     const {id} = req.params;

     !id ? res.status(404).json({success: false, errorMessage: "The user with the specified ID does not exist." })
       : db.findById(id)
            .then(user =>{
                res.status(200).json({user})
            })
            .catch(err =>{
                res.status(500).json({success: false, errorMessage: "The user information could not be retrieved.",err})
            })

})

 server.delete('/api/users/:id',(req,res) => {
    const {id} = req.params;
    !id ? res.status(404).json({success: false, errorMessage: "The user with the specified ID does not exist." })
    : db.remove(id)
        .then(user => {
            res.status(200).json({user})
        })
        .catch(err =>{
            res
              .status(500)
              .json({
                success: false,
                errorMessage: "The user could not be removed",err
              });
        })



 })

