var Trees = require('voxel-generators/objects/trees');
var Biomes = require('../voxel-biomes');

module.exports = {
    name : 'forest',
    rarity : 'common',
    mcmap : {
        1 : 'minecraft:grass',
        2 : 'minecraft:dirt',
        3 : 'minecraft:log',
        4 : 'minecraft:leaves',
    },
    groundGeometry : function(subX, subY, subZ, context){
        var lower = 8;
        var upper = 12;
        var trees = new Trees();
        var geometry = new Biomes.GeometryReducer(
            Generators.SeamlessNoiseFactory(
                context.seed,
                Generators.Noise.perlin(context.random),
                lower, upper
            )
        );
        for(var x=1; x < 30; x++){
            for(var z=1; z < 30; z++){
                if((context.random()*35) < 1) trees.add({
                    x:x,
                    y:0,
                    z:z,
                    height:26
                });
            }
        }
        geometry.add(trees);
        return geometry;
    }
}
