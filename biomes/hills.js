var Generators = require('voxel-generators');

module.exports = {
    name : 'hills',
    rarity : 'common',
    mcmap : {
        1 : 'minecraft:grass',
        2 : 'minecraft:dirt'
    },
    ground : function(subX, subY, subZ, context){
        return Generators.SeamlessNoiseFactory(
            context.seed,
            Generators.Noise.perlin(context.random),
            4, 19, function(x, y, z, value){
                return value;
            }
        );
    }
}
