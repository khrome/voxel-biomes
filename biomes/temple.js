var Generators = require('voxel-generators');

module.exports = {
    name : 'temple',
    rarity : 'rare',
    ground : function(subX, subY, subZ, context){
        return function(x, y, z){
            if(y==10) return 16;
            if(y<10) return 2;
            if(
                x-2 > (y-10) && x+2 < (32 - (y-10)) &&
                z-2 > (y-10) && z+2 < (32 - (y-10))
            ) return 1;
            return 0;
        }
    }
}
