const path=require("path");
export default{
    alias:{
        '@':path.resolve(__dirname,'src')
    },
   
    "extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
    ]
      
}
