voxel-biomes
============

Distribute generators across a surface in a deterministic way to produce volumetric terrain.

<img src="https://raw.githubusercontent.com/khrome/voxel-biomes/master/docs/screenshot.png" alt="terrain" width="800px">

[See it in action](https://khrome.github.io/voxel-biome-examples/index.html) (requires WebGL)

Each chunk is loaded without any information about the neighboring chunk, but the built in biomes produce continuous terrain, regardless.

Biome Options
-------------
- **name** - The label name of the biome
- **rarity** - common/uncommmon/rare
- **ground** - this is a function factory generator which defines voxels for the ground layer.
- **groundGeometry** - There are scenarios where you need to minimize the calculation of individual voxels and scenarios where you want to optimize the cost of a chunk. Defining the chunk in terms of a terrain generator and a set of voxels allows you to work in either mode. the function must return an instance of `require('voxel-biomes').GeometryReducer`
- **underground** - this is a function factory generator which defines all layers under the ground layer (defaults to solid dirt).
- **sky** - this is a function factory generator which defines all layers above the ground layer (defaults to 'solid' air).

Classes
-------
- `WorldBuilder` - The main export: an object which distributes biomes across the world and exports a single, composite generator.
    - `.addBiome(<biome object>)`
    - `.buildGenerator(<distribution algorithm>)`
- `.GeometryReducer(<generator function>)` - A voxel reducer you pass a generator function to in the constructor, then can pass coordinate lists, or `require('voxel-generators/objects/*')` instances.
    - `.integrated(context)` - export a submesh generator which minimizes the cost of generating a submesh
    - `.calculated(context)` - export a voxel generator factory which minimizes the cost of a calculation for any one voxel
    - `.add(<geometry or voxel-generator/object>)` - add more objects into the scene

Examples
--------

- [Simple Example](docs/simple.md) - This will produce a flat continuous 1 block thick slab as far as you can run. It will be material 1 in common areas, material 2 in uncommon areas and material 3 in rare areas, and because we pick a prime distribution, uncommon and rare biomes are more infrequent and continuous common areas increase in size as you move outward from the origin.
- [Realistic Example](docs/realistic.md) - This is pretty close to what you would see in minecraft, but with only a few biomes (and dead trees :P ), with an even distribution of biome sizes throughout (3x3 areas which means for every 9 common biomes there are 6 uncommons and 2 rares.
- [Transforming Materials](docs/transform-textures.md) - This is similar to the realistic example above, but uses hints on the biomes (`.mcmap`) to map from the default output to a loaded texture pack.
- [Client Only](https://github.com/khrome/voxel-biome-examples/blob/master/client.js) - A pure client side implementation which you can [check out live](https://khrome.github.io/voxel-biome-examples/index.html).
- **Other Uses** - The `biome.buildGenerator(<distribution>)` function produces a function factory, which you can wire up to anything.. building a garbage collection mob that resets chunks to their 'natural' state? saving just diffs from the natural state? building an entropy system? go nuts! The structure is essentially:

        function(chunkX, chunkY, chunkZ){
            //chunk specific work here
            return function(x, y, z){
                //voxel specific work here
            }
        }

Good Luck!

Writing Your Own Biome
----------------------
(Coming Soon )

Testing
-------
Eventually it'll be:

    mocha

Enjoy,

 -Abbey Hawk Sparrow
