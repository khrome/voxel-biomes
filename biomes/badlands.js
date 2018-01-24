var Generators = require('voxel-generators');

module.exports = {
    name : 'badlands',
    rarity : 'common',
    ground : function(subX, subY, subZ, context){
        return Generators.SeamlessNoiseFactory(
            context.seed,
            Generators.Noise.perlin(context.random),
            3, 25, function(x, y, z, value){
                if(value === 1) return 2;
                return value;
            }
        );
    }
}
