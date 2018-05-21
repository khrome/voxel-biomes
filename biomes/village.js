var Biomes = require('../voxel-biomes');
var Houses = require('voxel-generators/objects/houses');

module.exports = {
    name : 'village',
    rarity : 'rare',
    mcmap : {
        1 : 'minecraft:grass',
        2 : 'minecraft:dirt',
        3 : 'minecraft:stone'
    },
    groundGeometry : function(subX, subY, subZ, context){
        var houses = new Houses({});
        var geometry = new Biomes.GeometryReducer(function(x, y, z){
            if(y==10) return 1;
            if(y<10)return 2;
            return 0;
        });
        for(var x=3; x < 29; x++){
            for(var z=3; z < 29; z++){
                if((context.random()*100) < 1) houses.add({
                    x:x,
                    y:10,
                    z:z,
                    material:3
                });
            }
        }
        geometry.add(houses);
        return geometry;
    }
}
