voxel-biomes
============

Distribute generators across a surface in a deterministic way to produce volumetric terrain.

A Realistic Example
-------------------
This is pretty close to what you would see in minecraft, but with only a few biomes (and dead trees :P ), with an even distribution of biome sizes throughout (3x3 areas which means for every 9 common biomes there are 6 uncommons and 2 rares:


    var Server = require('voxel-async-simulation/server');
    var WorldBuilder = require('voxel-biomes');

    var builder = new WorldBuilder();
    builder.addBiome(require('voxel-biomes/biomes/hills'));
    builder.addBiome(require('voxel-biomes/biomes/forest'));
    builder.addBiome(require('voxel-biomes/biomes/village'));
    builder.addBiome(require('voxel-biomes/biomes/plains'));

    var app = new Server();
    app.setGenerator(builder.buildGenerator(
        WorldBuilder.Segmenters.modulo(3)
    ));
    app.setStorage(Server.Storage.memory());
    app.listen(8081, function(){
        console.log('Server listening on port 8081.');
    });


A Simple Example
----------------

This will produce a flat continuous 1 block thick slab as far as you can run. It will be material 1 in common areas, material 2 in uncommon areas and material 3 in rare areas, and because we pick a prime distribution, uncommon and rare biomes are more infrequent and continuous common areas increase in size as you move outward from the origin. Biomes are alternated in the order they are provided. In addition to hints from the distribution algorithm, `context` contains a deterministic `random()` function for use in generating this submesh, but still being reproducible.

    var WorldBuilder = require('./voxel-biome');

    var builder = new WorldBuilder();
    builder.addBiome({
        name : 'material-1',
        rarity : 'common',
        generator : function(subX, subY, subZ, context){
            return function(x, y, z){
                if (y===5) return 1;
                return 0;
            }
        }
    });
    builder.addBiome({
        name : 'material-2',
        rarity : 'uncommon',
        generator : function(subX, subY, subZ, context){
            return function(x, y, z){
                if (y===5) return 2;
                return 0;
            }
        }
    });
    builder.addBiome({
        name : 'material-3',
        rarity : 'rare',
        generator : function(subX, subY, subZ, context){
            return function(x, y, z){
                if (y===5) return 3;
                return 0;
            }
        }
    });

Transforming Output
-------------------
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

        //serve it here
    });


Serve It
--------

 Then to integrate it with [voxel-async-simulation](https://github.com/khrome/voxel-async-simulation)

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

 Otherwise you'll have to integrate it by hand... the `.buildGenerator()` function produces a function that looks something like:

    function(chunkX, chunkY, chunkZ){
        //chunk specific work here
        return function(x, y, z){
            //voxel specific work here
        }
    }

Good Luck!

Testing
-------
Eventually it'll be:

    mocha

Enjoy,

 -Abbey Hawk Sparrow
