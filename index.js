const Signal = require("signals");

function MangaClient(p_config) {
    let config = p_config;
    const configSocket = {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        autoConnect: false,
    }
    if (config.auth) {
        configSocket.auth = config.auth;
    }
    let socket = require('socket.io-client')(config.ip + ':' + config.port, configSocket);
    //making socket property public
    this.socket = socket;
    const me = this;
    this.isConnected = false;
    this.appName = config.appName;
    this.onConnect = new Signal();
    this.onDisconnect = new Signal();
    if (config.auth) {
        this.onConnect.add(() => {
            const { username, password } = config.auth;
            socket.emit('authentication', { username, password })
        })
    }
    function emit(method, ob, callback) {
        if (!me.isConnected) {
            return false;
        }
        socket.emit(method, ob, callback);
        return true;
    }
    this.set = (path, value, callback) => {
        return emit("set", { path, value }, callback);
    }
    this.reset = (path, value, callback) => {
        return emit("reset", { path, value }, callback);
    }
    this.message = (path, value, callback, save = false) => {
        return emit("message", { path, value, save }, callback);
    }
    this.get = (path, callback) => {
        return emit("get", { path }, callback);
    }
    this.delete = (path, callback) => {
        return emit("delete", { path }, callback);
    }
    let pathsCache = new Map();
    this.getPaths = () => {
        return pathsCache.keys();
    }
    function addListener(path, mode, p_callback) {
        let callback = p_callback;
        const method = path + "__" + mode;
        socket.on(method, callback);
        if (pathsCache.has(method)) {
            let info = pathsCache.get(method);
            info.count++;
            return;
        }
        const obj = {
            listener: {
                property: path,
                updateMode: mode
            },
            handler: {
                method
            }
        }
        pathsCache.set(method, { count: 0 });
        socket.emit("addListener", obj);
    }
    this.addListenerOnChange = (path, callback) => {
        addListener(path, "onChange", callback);
    }
    this.addListenerOnSet = (path, callback) => {
        addListener(path, "onSet", callback);
    }
    this.addListenerOnChangeLenth = (path, callback) => {
        addListener(path, "onChangeLength", callback);
    }
    this.removeListener = (path) => {
        pathsCache.delete(path);
        //TODO:não sei se é possível, verificar
    }
    this.connect = () => {
        socket.connect();
    }
    this.disconnect = () => {
        socket.disconnect();
    }
    socket.on('connect', (sock) => {
        me.isConnected = true;
        me.onConnect.dispatch();
        socket.emit("checkin", { "name": me.appName });
    });
    socket.on('disconnect', function () {
        me.isConnected = false;
        pathsCache.clear();
        me.onDisconnect.dispatch();
    });
}


module.exports = MangaClient;