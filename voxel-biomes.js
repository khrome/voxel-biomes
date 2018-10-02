var Generators = require('voxel-generators');
var rarities = ['common', 'uncommon', 'rare'];

function BiomeReducer(options){
    this.options = options || {};
    this.biomes = {
        common :[],
        uncommon : [],
        rare : []
    };
}

BiomeReducer.Segmenters = require('./voxel-biome-segmenters');
BiomeReducer.GeometryReducer = require('voxel-generators/voxel-geometry-reducer');

BiomeReducer.prototype.addBiome = function(biome){
    if(!biome) throw new Error('No biome passed');
    if(!biome.name) throw new Error('Biomes require a name');
    if((
        biome.ground ||
        biome.groundGeometry ||
        biome.underground ||
        biome.air
    ) && !biome.generator){
        var ob = this;
        var lookup = ob.options.blockLookup;
        //if we have a map, let's convert distill it
        var map = lookup && biome[lookup.mapName] &&
            JSON.parse(JSON.stringify(biome[lookup.mapName]));
        var mapper;
        if(map){
            //replace each index with it's rendered index
            Object.keys(map).forEach(function(key){
                var block = lookup.block(map[key]);
                map[key] = lookup.block(map[key]).flatIndex;
            });
            mapper = function(value){
                return map[value] || value;
            }
            biome.mapper = mapper;
        }
        if(biome.groundGeometry){
            biome.ground = function(subX, subY, subZ, context){
                return biome.groundGeometry(subX, subY, subZ, context).calculated(context, mapper);
            }
        }
        var ground = biome.ground || function(x, y, z){
            if(y==10) return 1;
            if(y<10) return 2;
            return 0;
        };
        var underground = biome.underground || function(){
            return function(x, y, z){
                return 2;
            };
        };
        var air = biome.air || function(){
            return function(x, y, z){
                return 0;
            };
        };
        biome.generator = function(subX, subY, subZ, context){
            var result;
            if(typeof subX == 'string') subX = parseInt(subX);
            if(typeof subY == 'string') subY = parseInt(subY);
            if(typeof subZ == 'string') subZ = parseInt(subZ);
            if(subY === 0) result = ground(subX, subY, subZ, context);
            if(subY > 0) result = air(subX, subY, subZ, context);
            if(subY < 0) result = underground(subX, subY, subZ, context);
            return mapper?function(x, y, z){
                return mapper(result(x, y, z));
            }:function(x, y, z){
                return result(x, y, z);
            };
        }
    }
    if(
        !(biome.generator || biome.generate)
    ){
        console.log(biome);
        throw new Error('Biomes require a generator');
    }
    if(!biome.rarity) biome.rarity = 'common';
    if(rarities.indexOf(biome.rarity) === -1){
        throw new Error('Unknown rarity:'+biome.rarity);
    }
    this.biomes[biome.rarity].push(biome);
}
var generateSubmesh = BiomeReducer.GeometryReducer.generateSubmesh;
BiomeReducer.prototype.buildGenerator = function(algorithm, offsets){
    var fn;
    if(!offsets) offsets = {};
    if(typeof algorithm == 'function'){
        fn = algorithm;
    }else{
        if(Segmenters[algorithm]) fn = Segmenters[algorithm]()
    }
    var name = this.options.name;
    if(!fn) throw new Error('No valid algorithm provided');
    var uncommon = this.biomes.uncommon.length?this.biomes.uncommon:this.biomes.common;
    var rare = this.biomes.rare.length?this.biomes.rare:uncommon;
    var biomes = {
        common : this.biomes.common,
        uncommon : uncommon,
        rare : rare,
    }
    var getSelection = function(subX, subY, subZ){
        var selection = fn(subX, subY, subZ);
        selection.seed = subX+'|'+subY+'|'+subZ;
        selection.random = Generators.Random.seed(selection.seed);
        return selection;
    }
    var result = function(subX, subY, subZ){
        var selection = getSelection(subX, subY, subZ);
        var selectedBiomes = biomes[selection.rarity];
        var index = (
            selection.index + ( offsets[selection.rarity] || 0)
        ) % selectedBiomes.length; //wraparound
        var biome = selectedBiomes[index];
        selection.type = biome.name;
        return biome.generator(subX, subY, subZ, selection);
    }

    result.submesh = function(x, y, z){
        var selection = getSelection(x, y, z);
        var selectedBiomes = biomes[selection.rarity];
        var index = (
            selection.index + ( offsets[selection.rarity] || 0)
        ) % selectedBiomes.length; //wraparound
        var biome = selectedBiomes[index];
        selection.name = (!!biome.options) && biome.options.name;
        return {
            generate : function(){
                if(biome.groundGeometry && y === 0){
                    var generator = biome.groundGeometry(x, y, z, selection).integrated(selection, biome.mapper);
                    return generator();//biome.mapper
                }else{
                    return generateSubmesh(result(x, y, z));
                }
            },
            context : function(){
                return selection;
            }
        }
    }

    return result;
}

module.exports = BiomeReducer;
