exports.buildBody = function(obj){
    let html = "";
    let index = obj["url"];
    for(let property in obj){
        if(obj.hasOwnProperty(property)){
            if(property.localeCompare("day_requested") !== 0 && property.localeCompare("dateTime_requested") !== 0){
              if(property.localeCompare("url") === 0)
                html = html.concat("<a href=" + obj[property] + ">" + obj[property] + "</a><br />")              
              else{
                obj[property].forEach((item) => {
                  item = item.substring(1);
                  
                  html = html.concat("<a href='" + index + item + "'> " + index + item + "</a><br />")
                })
                
              }
            }            
        }
    }
    return html;
}