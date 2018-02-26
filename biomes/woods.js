var Generators = require('voxel-generators');

var Biomes = require('../voxel-biomes');

module.exports = {
    name : 'woods',
    rarity : 'uncommon',
    mcmap : {
        1 : 'minecraft:grass',
        2 : 'minecraft:dirt',
        3 : 'minecraft:log',
        4 : 'minecraft:leaves',
    },
    /*ground : function(subX, subY, subZ, context){
        var trees = [];
        var rand;
        var lower = 8;
        var upper = 13;
        var trees = new Generators.Objects.Trees({
            groundHeightHigh : upper,
            groundHeightLow : lower,
            random : context.random
        });
        for(var x=0; x < 32; x++){
            for(var z=0; z < 32; z++){
                if((context.random()*40) < 1){
                    trees.addTree(x, z, 21, 3);
                }
                trees[x + z*32] = rand < 1?Math.floor(11+context.random()*15):0;
            }
        }
        var treeRender = trees.buildGenerator();
        return Generators.SeamlessNoiseFactory(
            context.seed,
            Generators.Noise.perlin(context.random),
            lower, upper, function(x, y, z, value){
                return treeRender(x, y, z, value);
            }
        );
    }*/
    groundGeometry : function(subX, subY, subZ, context){
        var lower = 8;
        var upper = 13;
        var trees = new Generators.Objects.Trees({
            groundHeightHigh : upper,
            groundHeightLow : lower,
            random : context.random
        });
        var geometry = new Biomes.GeometryReducer(
            Generators.SeamlessNoiseFactory(
                context.seed,
                Generators.Noise.perlin(context.random),
                lower, upper
            )
        );
        for(var x=0; x < 32; x++){
            for(var z=0; z < 32; z++){
                if((context.random()*40) < 1) trees.addTree(x, z, 21, 3);
            }
        }
        geometry.add(trees);
        return geometry;
    }
}
