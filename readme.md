# Manga Client

Node.js SDK client to Manga Server

## General Information

All `path` need to be passed using like a variable, becouse they will be transformed in variable in the server.

```
//ok:
{
    "path":"a.b.c"
}
//wrong:
{
    "path":"a b c"
}
```

If your path use integer numbers between points like { path:`a.2`, value:"passed value"}, they will be transformed to array:

```
{
    "a":[
        null,
        null,
        "passed value"
    ]
}
```

But it would to be avoid, do not do that! Prefere to use names and objects, not list.

# Methods

## checkin

```
{
    name:"Sofia System"
}
```

## set

```
{
    path:"semantic.path.here",
    value: {
        "wharever":{
            "you":"whant",
            "exemple": 3.2,
            "orList":[1,2,3]
        }
    }
}
```

## reset

```
{ path, value}
```

## message

Message is the most quickly method to send a message.

```
{ path, value, save, reset }
```

## get

```
{path}
```

## addListener

| Just to socket.io clients.

Cause you're connected so is better to recive data when that changes than need to keep asking every time to check it, are you agree?
Thinking about it `manga-js` create addListener with the same objective than `actions in C#` or `Signals` events.

You can add listener to property when that changes or are setted.

```
{
    listener:
        {
            property,
            updateMode
        },
    handler:
        {
            method
        }
}
```

#### example:

```
socket.emit("addListener", {
        listener:{
            property:"users.id_23423.nickName",
            updateMode:"onChange"
        },
        handler:{
            method:"myLocalMethodName"
        }
    }, (r)=>{
        console.log("addListener callback recived after save listener intemption", r ) ;
    }) ;
```

### listener.updateMode:

    updateMode is the trigger to start events to send message to the listener


    `onChange|onSet|onInterval|onChangeLength`

    `onChange` : when the value change something
    `onSet` : when the value is setted, changing or not
    `onInterval` : every time interval
    `onChangeLength` : when some object or array change the length property if it exists

### handler.method

    Is the method in client-side socket connection that will be called after event is trigger

### handler.filter

    Filter is used to handle data before is sent to listener client

```
{
    "listener":{
        "property":"user.id_23423.birthday",
        "updateMode":"onInterval",
        "frequency":1000
    },
    "handler":{
        "method":"myMethod",
        "filter":{
            "mode":"full|change", //if change, get just data that was changed, if full, get full data
            "data":"user.id_23423.profile" //data to recive after listener is trigger
        }
    }
}
```
