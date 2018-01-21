var Generators = require('voxel-generators');

function nextToTree(trees, x, z, tileSize){
    return (
        trees[(x+1) +  z   *tileSize] ||
        trees[(x+1) + (z+1)*tileSize] ||
        trees[ x    + (z+1)*tileSize] ||
        // -
        trees[(x-1) +  z   *tileSize] ||
        trees[(x-1) + (z-1)*tileSize] ||
        trees[ x    + (z-1)*tileSize] ||
        // +/-
        trees[(x+1) + (z-1)*tileSize] ||
        trees[(x-1) + (z+1)*tileSize]
    );
}

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
        var lower = 8;
        var upper = 12;
        return Generators.SeamlessNoiseFactory(
            context.seed,
            Generators.Noise.perlin(context.random),
            lower, upper, function(x, y, z, value){
                if(value === 1) return 16;
                var treeHeight = trees[x + z*32];
                //the trunk
                if(value === 0 && treeHeight && treeHeight >= y){
                    if(treeHeight > y) return 22;
                    if(treeHeight = y) return 25;
                }
                // slightly janky as we have to deterministicly pick a branch
                // height without knowing the ground height ::crosses fingers::
                var branchHeight = lower + Math.floor(
                    context.random()*(upper-lower)
                ) + 3;
                treeHeight = nextToTree(trees, x, z, 32)
                if(
                    (value === 0) && //don't overwite voxels
                    (treeHeight) && //there's a tree next to this pixel
                    y > branchHeight &&
                    y < treeHeight
                ){
                    var interval = Math.abs(Math.floor((treeHeight-branchHeight)/2));
                    var test = (y-2) % interval === 0;// ~2 clumps per tree
                    if(test) return 25;
                }
                return value;
            }
        );
    }
}
