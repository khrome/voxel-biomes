
module.exports = {
    name : 'plains',
    rarity : 'common',
    ground : function(subX, subY, subZ, context){
        return function(x, y, z){
            if(y==10) return 16;
            if(y<10) return 2;
            return 0;
        }
    }
}
