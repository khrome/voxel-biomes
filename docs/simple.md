A Simple Example
================

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
