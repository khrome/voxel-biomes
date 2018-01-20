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
        var selectedBiomes = biomes[selection.type];
        var index = selection.index % selectedBiomes.length; //wraparound
        return selectedBiomes[index].generator(subX, subY, subZ, selection);
    }
}

module.exports = BiomeReducer;
