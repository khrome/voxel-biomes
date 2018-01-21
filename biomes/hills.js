var Generators = require('voxel-generators');

module.exports = {
    name : 'hills',
    rarity : 'common',
    ground : function(subX, subY, subZ, context){
        return Generators.SeamlessNoiseFactory(
            context.seed,
            Generators.Noise.perlin(context.random),
            5, 15, function(x, y, z, value){
                if(value === 1) return 16;
                return value;
            }
        );
    }
}
