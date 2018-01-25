
module.exports = {
    name : 'desert',
    rarity : 'common',
    mcmap : {
        1 : 'minecraft:sand'
    },
    ground : function(subX, subY, subZ, context){
        return function(x, y, z){
            if(y<=10) return 1;
            return 0;
        }
    }
}
