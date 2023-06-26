const express =  require('express');
const cors = require('cors');
require('dotenv').config()
const db = require('./config/mongoose.js')
const router = require('./router/index.js');
const cookieParser = require('cookie-parser');
const path = require('path');

const Port = 3100;
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({credentials:true,origin:'http://localhost:5173'}));
app.use(cookieParser());
app.use('/uploads',express.static(path.join(__dirname,'/uploads')))




app.use('/', router);

// ASINUZtYQEL1qUMh

app.listen( Port, function(){
    console.log("Server is running on the Port: ", Port)
})

