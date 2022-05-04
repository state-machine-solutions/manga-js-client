const MangaClient = require("../index")
var config = {
    ip:"http://localhost",
    port:8000,
    appName:"My client name"
};
var reciver = new MangaClient(config);

reciver.onConnect.add(()=>{
    console.log("=== RECIVER CONNECTED");
    reciver.addListenerOnChange("test.onchanges.value1", (value)=>{
        console.log("addListenerOnChange 1", value) ;
    }) ;
    reciver.addListenerOnChange("test.onchanges.value2", (value)=>{
        console.log("addListenerOnChange 2", value) ;
    }) ;
    reciver.addListenerOnSet("test.onset.value1", (value)=>{
        console.log("addListenerOnSet ", value) ;
    }) ;
    reciver.addListenerOnChangeLenth("test.onchangeLength.list1", (value)=>{
        console.log("addListenerOnChangeLenth ", value) ;
    }) ;
})
reciver.connect();