var Generators = require('voxel-generators');

module.exports = {
    name : 'forest',
    rarity : 'common',
    ground : function(subX, subY, subZ, context){
        var trees = [];
        var rand;
        for(var x=0; x < 32; x++){
            for(var z=0; z < 32; z++){
                rand = context.random()*40;
                trees[x + z*32] = rand < 1?Math.floor(11+context.random()*15):0;
            }
        }
        return Generators.SeamlessNoiseFactory(
            context.seed,
            Generators.Noise.perlin(context.random),
            8, 12, function(x, y, z, value){
                if(value === 1) return 16;
                var treeHeight = trees[x + z*32];
                if(value === 0 && treeHeight && treeHeight >= y){
                    return 19;
                }
                return value;
            }
        );
    }
}
