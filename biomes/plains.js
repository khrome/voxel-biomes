
module.exports = {
    name : 'plains',
    rarity : 'common',
    mcmap : {
        1 : 'minecraft:grass',
        2 : 'minecraft:dirt'
    },
    ground : function(subX, subY, subZ, context){
        return function(x, y, z){
            if(y==10) return 1;
            if(y<10) return 2;
            return 0;
        }
    }
}
