const express = require('express');
const app = express();
const port = process.env.PORT || 9800;
const bodyParser = require('body-parser');
const cors = require ('cors');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const mongourl = "mongodb+srv://saumil:Saumil@123@cluster0.b3q57.mongodb.net/internship?retryWrites=true&w=majority";
let db;

app.use(cors())
//encode data while insert
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
//health route(default)
app.get('/',(req,res) =>{
    res.send("The server is running behind the API");
});

//city route
app.get('/city',(req,res) =>{
  let sortcondition ={city_name:1};
  let limit = 100;
  if(req.query.sort && req.query.limit ){
    sortcondition = {city_name:Number(req.query.sort)}
    limit= Number(req.query.limit)
  }

    else if(req.query.sort){
      sortcondition = {city_name:Number(req.query.sort)}
    }
    else if(req.query.limit){
      limit= Number(req.query.limit)
    }
    db.collection('city').find().sort(sortcondition).limit(limit).toArray((err,result)=>{
      if(err) throw err;
      res.send(result);
    });
});
//rest route
app.get('/rest',(req,res) =>{
  var condition = {};

  if(req.query.mealtype && req.query.lcost && req.query.hcost){
    condition={$and:[{"type.mealtype":req.query.mealtype},{cost:{$lt:Number(req.query.hcost),$gt:Number(req.query.lcost)}}]}
  }
  
  else if(req.query.mealtype && req.query.city){
    condition={$and:[{"type.mealtype":req.query.mealtype},{city:req.query.city }]}
  }
  else if(req.query.mealtype && req.query.cuisine){
    condition={$and:[{"type.mealtype":req.query.mealtype},{"Cuisine.cuisine":req.query.cuisine }]}
  }
  else if(req.query.mealtype){
    condition={"type.mealtype":req.query.mealtype}
  }
  else if(req.query.city){
    condition={city:req.query.city}
  }
    db.collection('restaurent').find(condition).toArray((err,result) =>{
    if(err) throw err;
    res.send(result);
  });
  
})
//rest per city
app.get('/rest/:id',(req,res) =>{
  var id = req.params.id;
  db.collection('restaurent').find({_id:id}).toArray((err,result) =>{
  if(err) throw err;
  res.send(result);  
  })
})
//mealtype route
app.get('/mealtype',(req,res) =>{
  db.collection('mealType').find().toArray((err,result) =>{
  if(err) throw err;
  res.send(result);
});

})
//cuisine route
app.get('/cuisines',(req,res) =>{
  db.collection('cuisine').find().toArray((err,result) =>{
  if(err) throw err;
  res.send(result);
});

})
//placeorder
app.post('/placeorder',(req,res) =>{
db.collection('Orders').insert(req.body,(err,result) =>{
  if(err) throw err;
  res.send('Data added')
})
})
//get all bookings
app.get('/orders',(req,res) =>{
  db.collection('Orders').find({}).toArray((err,result) =>{
    if(err) throw err;
    res.send(result)
  })
  })
//
//connection with db
MongoClient.connect(mongourl,(err,connection) =>{
  if(err) console.log(err);
  db = connection.db('internship')
})

app.listen(port,function(err){
    if(err) throw err;
    console.log(`sever is running on port ${port}`)
})