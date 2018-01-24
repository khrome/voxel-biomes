
module.exports = {
    name : 'desert',
    rarity : 'common',
    ground : function(subX, subY, subZ, context){
        return function(x, y, z){
            if(y==10) return 31;
            if(y<10) return 2;
            return 0;
        }
    }
}
