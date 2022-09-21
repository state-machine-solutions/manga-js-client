const MangaClient = require("../index")
var config = {
    ip:"http://localhost",
    port:9293,
    appName:"My client name",
    auth:{
        username: 'abc',
        password: '123'
    }
};
var reciver = new MangaClient(config);
reciver.onDisconnect.add(()=>{console.log('disconnected')});
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
console.log("trying connect");
reciver.connect();
