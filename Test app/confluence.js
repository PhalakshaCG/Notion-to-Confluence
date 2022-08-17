var Confluence = require("confluence-api");
var config = {
    username: "phalakshacg01@gmail.com",
    password: process.env.CONFLUENCE_PASSWORD,
    baseUrl:  "https://frightknight.atlassian.net/wiki",
    version: 1 // Confluence major version, optional
};
var confluence = new Confluence(config);
//confluence.createAttachment("~62fa5a65eec8d4a478d3c534","884650","./notion.html",function(err,data){console.log(err)})
async function postContent(content,title){
    confluence.getContentByPageTitle("~62fa5a65eec8d4a478d3c534", title,function(err, data) {
        if(data.results[0]){
             let version = parseInt(data.results[0].version.number)+1
             id=data.results[0].id
            console.log("Called Put. Version:"+version)
            if(title=='Graph')console.log(data.results[0].body)
            confluence.putContent("~62fa5a65eec8d4a478d3c534",id,version,title,content,function(err,data){
            console.log(err)
     })}
     else{
        confluence.postContent("~62fa5a65eec8d4a478d3c534",title,content,null,function(err,data){
            console.log(err)
            console.log("Called Post")
        })
     }
    })
}
//getContent()
module.exports = postContent