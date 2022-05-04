const Signal = require("signals") ;

function MangaClient(p_config){
    let config = p_config ;
    let socket = require('socket.io-client')(config.ip+':'+config.port);
    
    var me = this ;
    this.isConnected = false ;
    this.appName = config.appName;
    this.onConnect = new Signal() ;
    this.onDisconnect = new Signal() ;
    function emit(method, ob, callback){
        if(!me.isConnected){
            return false;
        }
        socket.emit(method, ob, callback) ;
        return true ;
    }
    this.set = (path, value, callback)=>{
        return emit("set", {path, value}, callback) ;
    }
    this.reset = (path, value, callback)=>{
        return emit("reset", {path, value}, callback) ;
    }
    this.message = (path, value, callback, save = false)=>{
        return emit("message", {path, value, save}, callback) ;
    }
    this.get = (path, callback)=>{
        return emit("get", {path}, callback) ;
    }
    this.delete = (path, callback)=>{
        return emit("delete", {path}, callback) ;
    }
    let pathsCache = new Map() ;
    this.getPaths = ()=>{
        return pathsCache.keys() ;
    }
    function addListener(path, mode, p_callback){
        let callback = p_callback ;
        var method = path+"__"+mode ;
        socket.on(method, callback );
        if(pathsCache.has(method)){
            let info = pathsCache.get(method) ;
            info.count ++ ;
            return ;
        }
        var obj = {
            listener:{
                property:path,
                updateMode:mode
            },
            handler:{
                method
            }
        }
        pathsCache.set(method, {count:0}) ;
        socket.emit( "addListener", obj ) ;
    }
    this.addListenerOnChange = (path, callback)=>{
        addListener(path, "onChange", callback) ;
    }
    this.addListenerOnSet = (path, callback)=>{
        addListener(path, "onSet", callback) ;
    }
    this.addListenerOnChangeLenth = (path, callback)=>{
        addListener(path, "onChangeLength", callback) ;
    }
    this.removeListener = (path)=>{
        pathsCache.delete( path ) ;
        //TODO:não sei se é possível, verificar
    }
    this.connect = ()=>{
        socket.connect() ;
    }
    this.disconnect = ()=>{
        socket.disconnect() ;
    }
    socket.on('connect', (sock)=>{
        me.isConnected = true ;
        me.onConnect.dispatch();
        socket.emit("checkin", {"name": me.appName });
    });
    socket.on('disconnect', function(){
        me.isConnected = false ;
        pathsCache.clear() ;
        me.onDisconnect.dispatch() ;
    });
}


module.exports = MangaClient;