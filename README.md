voxel-biomes
============

Distribute generators across a surface in a deterministic way to produce volumetric terrain.

<img src="https://raw.githubusercontent.com/khrome/voxel-biomes/master/docs/screenshot.png" alt="terrain" width="400px">
[See it in action](https://khrome.github.io/voxel-biome-examples/index.html)(requires WebGL)

Each chunk is loaded without any information about the neighboring chunk, but the built in biomes produce continuous terrain, regardless.

A Simple Example
----------------

This will produce a flat continuous 1 block thick slab as far as you can run. It will be material 1 in common areas, material 2 in uncommon areas and material 3 in rare areas, and because we pick a prime distribution, uncommon and rare biomes are more infrequent and continuous common areas increase in size as you move outward from the origin. See the [full configuration](docs/simple.md).

A Realistic Example
-------------------
This is pretty close to what you would see in minecraft, but with only a few biomes (and dead trees :P ), with an even distribution of biome sizes throughout (3x3 areas which means for every 9 common biomes there are 6 uncommons and 2 rares. See the [full configuration](docs/realistic.md).

Transforming Materials
----------------------
This is similar to the realistic example above, but uses hints on the biomes (`.mcmap`) to map from the default output to a loaded texture pack. See the [full configuration](docs/transform-textures.md).

Client Only
-------------

See the [source](https://github.com/khrome/voxel-biome-examples/blob/master/client.js) from the [demo](https://khrome.github.io/voxel-biome-examples/index.html).

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
