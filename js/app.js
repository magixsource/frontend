requirejs.config({
    baseUrl:'js/lib',
    paths:{
        app:'../app'
    },
    shim:{
        error:{
            exports:"error",
            deps:["jquery"]
        },
        text:{
            exports:"text",
            deps:['error']
        }

    }
});