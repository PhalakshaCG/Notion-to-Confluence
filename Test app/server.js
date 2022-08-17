require('dotenv').config()
const fs = require('fs')
const notion = require('./notion')
const express = require('express')
const confluence = require('./confluence')



const app = express()
app.listen(process.env.PORT)
app.get('/',(req,res)=>{
  res.send("Hello world")
  res.send(s)
})

// const Client = require('@notionhq/client')
// const exp = require('constants')
// const notion = new Client({
//     auth: process.env.NOTION_API_KEY
//   })
//   var listUsersResponse
//   ;(async () => {
//     listUsersResponse = await notion.users.list({})
//   })().then = function(){console.log(listUsersResponse)}
  
//fs.writeFileSync('notes.txt',"Hello");