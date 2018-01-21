Generators = require('voxel-generators');
var rarities = ['common', 'uncommon', 'rare'];

function BiomeReducer(){
    this.biomes = {
        common :[],
        uncommon : [],
        rare : []
    };
}

BiomeReducer.Segmenters = require('./voxel-biome-segmenters');

BiomeReducer.prototype.addBiome = function(biome){
    if(!biome) throw new Error('No biome passed');
    if(!biome.name) throw new Error('Biomes require a name');
    if((biome.ground || biome.underground || biome.air) && !biome.generator){
        var ground = biome.ground || function(x, y, z){
            if(y==10) return 1;
            if(y<10) return 2;
            return 0;
        };
        var underground = biome.underground || function(x, y, z){
            return 1;
        };
        var air = biome.air || function(x, y, z){
            return 0;
        };
        biome.generator = function(subX, subY, subZ, context){
            if(typeof subX == 'string') subX = parseInt(subX);
            if(typeof subY == 'string') subY = parseInt(subY);
            if(typeof subZ == 'string') subZ = parseInt(subZ);
            if(subY === 0) return ground(subX, subY, subZ, context);
            if(subY > 0) return air(subX, subY, subZ, context);
            if(subY < 0) return underground(subX, subY, subZ, context);
            console.log('ERRR!', typeof subY);
        }
    }
    if(
        !(biome.generator || biome.generate)
    ) throw new Error('Biomes require a generator');
    if(!biome.rarity) biome.rarity = 'common';
    if(rarities.indexOf(biome.rarity) === -1){
        throw new Error('Unknown rarity:'+biome.rarity);
    }
    this.biomes[biome.rarity].push(biome);
}

BiomeReducer.prototype.buildGenerator = function(algorithm){
    var fn;
    if(typeof algorithm == 'function'){
        fn = algorithm;
    }else{
        if(Segmenters[algorithm]) fn = Segmenters[algorithm]()
    }
    if(!fn) throw new Error('No valid algorithm provided');
    var uncommon = this.biomes.uncommon.length?this.biomes.uncommon:this.biomes.common;
    var rare = this.biomes.rare.length?this.biomes.rare:uncommon;
    var biomes = {
        common : this.biomes.common,
        uncommon : uncommon,
        rare : rare,
    }
    return function(subX, subY, subZ){
        var selection = fn(subX, subY, subZ);
        selection.seed = subX+'|'+subY+'|'+subZ;
        selection.random = Generators.Random.seed(38);
        var selectedBiomes = biomes[selection.rarity];
        var index = selection.index % selectedBiomes.length; //wraparound
        var biome = selectedBiomes[index];
        selection.type = biome.name;
        return biome.generator(subX, subY, subZ, selection);
    }
}

module.exports = BiomeReducer;
