var Trees = require('voxel-generators/objects/trees');
//console.log("WHAT THE FUCK");
//console.log('??', Trees);
//process.exit();

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
    groundGeometry : function(subX, subY, subZ, context){
        var lower = 8;
        var upper = 13;
        var trees = new Trees();
        var geometry = new Biomes.GeometryReducer(
            Generators.SeamlessNoiseFactory(
                context.seed,
                Generators.Noise.perlin(context.random),
                lower, upper
            )
        );
        for(var x=2; x < 30; x++){
            for(var z=2; z < 30; z++){ //this is view perspective z
                if((context.random()*40) < 1) trees.add({
                    x:x,
                    y:0,
                    z:z,
                    height:20
                });
            }
        }
        geometry.add(trees);
        return geometry;
    }
}
