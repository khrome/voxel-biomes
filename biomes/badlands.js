var Generators = require('voxel-generators');

module.exports = {
    name : 'badlands',
    rarity : 'common',
    mcmap : {
        1 : 'minecraft:sandstone',
        2 : 'minecraft:sandstone'
    },
    ground : function(subX, subY, subZ, context){
        return Generators.SeamlessNoiseFactory(
            context.seed,
            Generators.Noise.perlin(context.random),
            3, 25, function(x, y, z, value){
                return value;
            }
        );
    }
}
