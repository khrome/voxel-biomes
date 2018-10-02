var Generators = require('voxel-generators');
module.exports = {
    name : 'desert',
    rarity : 'common',
    mcmap : {
        1 : 'minecraft:sand'
    },
    ground : function(subX, subY, subZ, context){
        return Generators.SeamlessNoiseFactory(
            context.seed,
            Generators.Noise.perlin(context.random),
            6, 14, function(x, y, z, value){
                return value;
            }
        );
    }
}
