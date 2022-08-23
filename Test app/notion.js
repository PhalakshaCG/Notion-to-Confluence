const {Client} = require('@notionhq/client')
const exp = require('constants')
const { text } = require('express')
const { type } = require('os')
const confluence = require('./confluence')
const convert = require('./convert')
const notion = new Client({
    auth: process.env.NOTION_API_KEY
  })


async function getDatabase(id){
    const db = await notion.databases.query({
        database_id : id
        
    })
	//console.log(db.results)
    return db
  }

  async function getDBName(id){
	let name  = await notion.databases.retrieve({
		database_id: id
	})
	name = await convert.getStylingTable(name.title)
	return name
  }
  async function getDBNameFromPage(id){
	let page = await notion.pages.retrieve({
		page_id:id
	})
	let name = await getDBName(page.parent.database_id)
	return name
  }
  async function getPageID(url){
	let str = url.substring(22).split("-")
  	let s= str[str.length-1]
	let name = s.substring(0,8)+'-'+s.substring(8,12)+'-'+s.substring(12,16)+'-'+s.substring(16,20)+'-'+s.substring(20)
	return name
  }
  async function getPageName(url){
	let str = url.substring(22).split("-")
  	let name=str[0]
	for(let i=1;i<str.length-1;i++)
	name+=" "+str[i]
	return name
  }
async function getPages(urlfull){
	url = urlfull.substring(22)
	let pages = []
	let names = []
	let dbnames=[]
	if(url.includes("?v=")){
		let id = url.split('?')[0]
		console.log(id)
		const db = await getDatabase(id)
		for(let i=0;i<db.results.length;i++){
			dbnames[i] = await getDBName(id)
			//console.log(db.results[i].id)
			pages[i] = await notion.blocks.children.list({
			block_id: db.results[i].id
		})
		names[i] = await getPageName(db.results[i].url)
		console.log(names[i])
		}
	}
	else{
		let id = await getPageID(urlfull)
		console.log(id)
		pages[0] = await notion.blocks.children.list({
				block_id: id
		})
		dbnames[0]=await getDBNameFromPage(id)
		console.log(dbnames[0])
		names[0]=await getPageName(urlfull)
	}
	
	return {pages,names,dbnames}
  
}


async function getChildren(page){
    let response  = await notion.blocks.children.list({
      block_id: page.id
    })
	return response
}


async function printPages(url,callback){
  const {pages,names,dbnames} = await getPages(url)
  let html =""
  for(let i=0;i<pages.length;i++){
	//console.log(names[i])
   //console.log("\nPage " +(i+1)+":")
    let cur_page = pages[i]
	let num = 0
	html=""
    for(let j=0;j<cur_page.results.length;j++){
		let cur_result = cur_page.results[j]
		if(cur_result.hasOwnProperty('type')){
			let type = cur_result.type;
			switch(type){
				case "paragraph": 	html+= '<p>'+await convert.paragraphToHTML(cur_result.paragraph)+'</p>'
									break 
				case "code": 		html+= await convert.codeToHTML(cur_result.code) 
									break
				case "heading_1":   html+= '<h1>' + await convert.paragraphToHTML(cur_result.heading_1) +"</h1>"
									break
				case "heading_2":   html+= '<h2>' + await convert.paragraphToHTML(cur_result.heading_1) +"</h2>"
									break
				case "heading_3":   html+= '<h3>' + await convert.paragraphToHTML(cur_result.heading_1) +"</h3>"
									break
				case "numbered_list_item":	if(num==0){
												html+='<ol>'
												num++
											}
											html+='<li>'+await convert.paragraphToHTML(cur_result.numbered_list_item)+'</li>'
											if(!cur_page.results[j+1]||!cur_page.results[j+1].hasOwnProperty('type')||cur_page.results[j+1].type!='numbered_list_item'){
												num=0;
												html+='</ol>'
											}
											break;
				case "to_do":		html+= '<label>' + await convert.listItemToHTML(cur_result.to_do) +'</label>'
											break;
				case "table":		let children = await getChildren(cur_result)
									let table = await convert.tableToHTML(children.results,cur_result.table.table_width)
									html+=table
									break
				case "equation":	html+='<math>'+await convert.paragraphToHTML(cur_result.equation)+'</math>'
									break 
				case "bulleted_list_item" : html+='<ul><li>'+await convert.paragraphToHTML(cur_result.bulleted_list_item)+'</li></ul>'
									break
				case "quote":		if(cur_result[type].rich_text!=undefined){
										html+='<blockquote>'
										for(var i1=0;i1<cur_result[type].rich_text.length;i1++)
										html+=cur_result[type].rich_text[i1].plain_text;
										html+="</blockquote><br/>"
									}
									break
				case "divider":		html+="<hr/>"
									break
				case "callout":		if(cur_result[type].rich_text!=undefined){
										html+='<code>'
										html+=cur_result[type].icon.emoji+cur_result[type].rich_text[0].plain_text;
										html+="</code><br/>"
									}
									break;
				default:         	
									if(cur_result[type].rich_text!=undefined){
										html+='<p>'
										for(var i1=0;i1<cur_result[type].rich_text.length;i1++)
										html+=cur_result[type].rich_text[i1].plain_text;
										html+="</p><br/>"
									}

			}
    	}
  	}
	  await confluence(html,names[i],dbnames[i])
}
	callback()

}
module.exports=printPages
//printPages