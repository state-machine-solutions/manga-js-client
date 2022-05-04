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

```
{listener:{path, property}, handler:{method}}
```

```
socket.emit("addListener", {
        listener:{
            property:"scene.bodies.0.alarm",
            updateMode:"onChange"
        },
        handler:{
            method:"myLocalMethodName"
        }
    }, (r)=>{
        console.log("addListener callback recived after save listener intemption", r ) ;
    }) ;
```

### updateMode:

    `onChange` : pode ser "onSet" se quiser ser avisado sempre que o valor for setado

que é quando a quantidade de itens no array muda
"onChange|onSet|onInterval|onChangeLength"
onInterval é bizarro, ele fica te chamando a cada X tempo, independente do que aconteça, evite usar por enquanto
info:{
"listener":{
"property":"scenario.weather.barometer.pressure",
"updateMode":"onChange|onSet|onInterval|onChangeLength",
"frequency":1000
},
"handler":{
"method":"myMethod",
"filter":{
"mode":"full|changed",//em teoria o changed te dá so os dados que mudou, a testar
"data":"scenario.weather"//esse aqui depois explico, vou jantar rs
}
}
}
