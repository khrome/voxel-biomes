voxel-biomes
============

Distribute generators across a surface in a deterministic way to produce volumetric terrain.

A Simple Example
----------------

This will produce a flat continuous 1 block thick slab as far as you can run. It will be material 1 in common areas, material 2 in uncommon areas and material 3 in rare areas, and because we pick a prime distribution, uncommon and rare biomes are more infrequent and continuous common areas increase in size as you move outward from the origin. Biomes are alternated in the order they are provided. In addition to hints from the distribution algorithm, `context` contains a deterministic `random()` function for use in generating this submesh, but still being reproducible.

```javascript
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
```

A Realistic Example
-------------------
This is pretty close to what you would see in minecraft, but with only a few biomes (and dead trees :P ), with an even distribution of biome sizes throughout (3x3 areas which means for every 9 common biomes there are 6 uncommons and 2 rares. See the [full configuration](docs/realistic.md).

Transforming Materials
----------------------
This is similar to the realistic example above, but uses hints on the biomes (`.mcmap`) to map from the default output to a loaded texture pack. See the [full configuration](docs/transform-textures.md).

On the Client
-------------

```javascript
    var subgen = builder.buildGenerator(
        WorldBuilder.Segmenters.primes()
    )

    function generateSubmesh(x, y, z){
        var data = new Int8Array(32*32*32);
        var xOff = 32 * 32;
        yOff = 32;
        var xPart;
        var yPart;
        var gen = subgen(x, y, z);
        for(var x=0; x < 32; x++ ){
            xPart = x * xOff;
            for(var y=0; y < 32; y++ ){
                yPart = y * yOff;
                for(var z=0; z < 32; z++ ){
                    data[xPart + yPart + z] = gen(x, y, z);
                }
            }
        }
        return data;
    }

    var createGame = require('voxel-engine');
    var game = createGame({
        generateVoxelChunk: function(low, high, x, y, z){
            return chunk = {
                position : [x, y, z],
                voxels : generateSubmesh(x, y, z),
                dims : [32, 32, 32],
                empty : false
            };
        },
        // (other options)
    });
```

Other uses
----------

The `biome.buildGenerator(<distribution>)` function produces a function factory, which you can wire up to anything.. building a garbage collection mob that resets chunks to their 'natural' state? saving just diffs from the natural state? building an entropy system? go nuts! The structure is essentially:

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
