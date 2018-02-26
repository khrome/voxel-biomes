var Generators = require('voxel-generators');

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
                if((context.random()*35) < 1) trees.addTree(x, z, 26, 3);
            }
        }
        geometry.add(trees);
        return geometry;
    }
}
