A Realistic Example
===================
This is pretty close to what you would see in minecraft, but with only a few biomes (and dead trees :P ), with an even distribution of biome sizes throughout (3x3 areas which means for every 9 common biomes there are 6 uncommons and 2 rares:


    var Server = require('voxel-async-simulation/server');
    var WorldBuilder = require('voxel-biomes');

    var builder = new WorldBuilder();
    builder.addBiome(require('voxel-biomes/biomes/hills'));
    builder.addBiome(require('voxel-biomes/biomes/forest'));
    builder.addBiome(require('voxel-biomes/biomes/village'));
    builder.addBiome(require('voxel-biomes/biomes/plains'));

    var app = new Server();
    //need this for localhost
    app.use(function(req, res, next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, PATCH, GET, POST, DELETE, OPTIONS'
        );
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
        );
        res.setHeader(
            'Access-Control-Allow-Credentials', true
        );
        next();
    });
    app.setGenerator(builder.buildGenerator(
        WorldBuilder.Segmenters.modulo(3)
    ));
    app.setStorage(Server.Storage.memory());
        app.listen(8081, function(){
        console.log('Server listening on port 8081.');
    });
