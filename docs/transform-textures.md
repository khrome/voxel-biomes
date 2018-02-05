Transforming Materials
----------------------
This is similar to the realistic example above, but uses hints on the biomes (`.mcmap`) to map from the default output to a loaded texture pack.

    var Server = require('voxel-async-simulation/server');
    var WorldBuilder = require('voxel-biomes');
    var texturePackLoad = require(
        'voxel-minecraft-texture-pack-loader'
    );

    var path = './texture-packs/PhotoRealistic';
    texturePackLoad(path, function(err, texturePack){
        if(err) return console.log('Textures failed to load.');
        console.log('Textures Loaded.');
        var builder = new WorldBuilder({
            blockLookup : texturePack
        });
        builder.addBiome(require('voxel-biomes/biomes/hills'));
        builder.addBiome(require('voxel-biomes/biomes/badlands'));
        builder.addBiome(require('voxel-biomes/biomes/forest'));
        builder.addBiome(require('voxel-biomes/biomes/woods'));
        builder.addBiome(require('voxel-biomes/biomes/village'));
        builder.addBiome(require('voxel-biomes/biomes/temple'));
        builder.addBiome(require('voxel-biomes/biomes/megalith'));
        builder.addBiome(require('voxel-biomes/biomes/plains'));
        builder.addBiome(require('voxel-biomes/biomes/field'));
        builder.addBiome(require('voxel-biomes/biomes/desert'));

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
            WorldBuilder.Segmenters.primes()
        ));
        app.setStorage(Server.Storage.memory());
            app.listen(8081, function(){
            console.log('Server listening on port 8081.');
        });
    });
