var Confluence = require("confluence-api");
var request = require('superagent');
// This code sample uses the 'node-fetch' library:
// https://www.npmjs.com/package/node-fetch
var config = {
    username: "phalakshacg01@gmail.com",
    password: process.env.CONFLUENCE_PASSWORD,
    baseUrl:  "https://frightknight.atlassian.net/wiki",
    version: 1 // Confluence major version, optional
};
const fetch = require('node-fetch');

function getBodyData(dbname){
    return `{
  "key": "`+dbname.replaceAll(" ","")+`",
  "name": "`+dbname+`",
  "description": {
    "plain": {
      "value": "",
      "representation": ""
    }
  },
  "permissions": []
}`;
}
async function addSpaceAndPost(dbname,callback){

let spaceContent = await getBodyData(dbname);
request
        .post(config.baseUrl + "/rest/api/space/")
        .auth(config.username,config.password)
        .type('json')
        .send(spaceContent)
        .end(function(err, res){
            callback()
        });
        
}

function uploadContentToPage(content,title,spaceKey){
    confluence.getContentByPageTitle(spaceKey, title,function(err, data) {
        if(data.results!=undefined&&data.results[0]){
          //console.log(data.results[0].body.storage)
            let version = parseInt(data.results[0].version.number)+1
            id=data.results[0].id
            console.log("Called Put. Version:"+version)
            confluence.putContent(spaceKey,id,version,title,content,function(err,data){
            console.log(err)
            
    })}
    else{
        confluence.postContent(spaceKey,title,content,null,function(err,data){
            console.log(err)
            console.log("Called Post")
        
        })
    }
    })
}

var confluence = new Confluence(config);
async function postContent(content,title,dbname){
            let spaceKey = await dbname.replaceAll(" ","")
            confluence.getSpace(spaceKey,(err,data)=>{
                if(data.results.length==0){
                        addSpaceAndPost(dbname,()=>{
                                uploadContentToPage(content,title,spaceKey)
                        });
                        
              
              }else{
                uploadContentToPage(content,title,spaceKey)
              }})
            
        
}
//getContent()
module.exports = postContent