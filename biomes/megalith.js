var Generators = require('voxel-generators');

module.exports = {
    name : 'megalith',
    rarity : 'rare',
    ground : function(subX, subY, subZ, context){
        return function(x, y, z){
            if(y==10) return 2;
            if(y<10) return 2;
            return 0;
        }
    }
}
