require('dotenv').config()
const fs = require('fs')
const notion = require('./notion')
const express = require('express')
const confluence = require('./confluence')
const cors = require("cors")
const app = express()
app.listen(process.env.PORT)
app.use(cors({
    origin: 'https://www.notion.so'
}));
app.get('/',(req,res)=>{
  // let str = req.headers.url.substring(22).split("?")
  // let name = str[0]
  
  // 	if(str.length>2)
	// for(let j=1;j<str.length-1;j++)
	// 	name+=" "+str[j]
  notion(req.headers.url,function(){
    res.send("Done")
  })
  console.log("sending response")
  
})
