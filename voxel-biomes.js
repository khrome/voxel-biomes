Generators = require('voxel-generators');
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

BiomeReducer.GeometryReducer = function(chunkFunc){
    this.chunk = new Int8Array(32*32*32);
    for(var x=0; x < 32; x++){
        for(var y=0; y < 32; y++){
            for(var z=0; z < 32; z++){
                this.chunk[x*32*32 + y*32 + z] = chunkFunc(x, y, z);
            }
        }
    }
    this.objects = [];
}

BiomeReducer.GeometryReducer.prototype.add = function(ob, offset){
    this.objects.push({data:ob, offset:offset});
}

var writeInto = function(object, destination, dontOverwrite){
    object.forEach(function(coord){
        var x = coord[0];
        var y = coord[1];
        var z = coord[2];
        var arrOff = x*32*32 + y*32 + z;
        var material = coord[3] || 1;
        if(!destination[arrOff] || !dontOverwrite) destination[arrOff] = material;
    });
}

//build a complete set of voxels which reduces the overall cost
BiomeReducer.GeometryReducer.prototype.integrated = function(context){
    var result = this.chunk.slice(0);
    var objects = this.objects;
    return function(){
        objects.forEach(function(geom){
            if(geom.data.writeInto){
                geom.data.writeInto(context.random, result, true);
            }else{
                var offset = geom.offset || {};
                var offsetGeometry = geom.data.map(function(coords){
                    return [
                        coords[0] + (offset.x || 0),
                        coords[1] + (offset.y || 0),
                        coords[2] + (offset.z || 0)
                    ]
                });
                writeInto(offsetGeometry, result, true);
            }
        });
        return result;
    }
}

//output a function factory which minimizes the calculation of a single voxel
BiomeReducer.GeometryReducer.prototype.calculated = function(context){
    transformedObjects = [];
    this.objects.forEach(function(geom, index){
        var offset = geom.offset || {};
        var min = {};
        var max = {};
        transformedObjects[index] = geom.data.buildGenerator?geom.data:{geometry:geom.data.map(function(coords){
            var result =  [
                coords[0] + (offset.x || 0),
                coords[1] + (offset.y || 0),
                coords[2] + (offset.z || 0)
            ];
            if((!min.x) || min.x > result[0]);
            if((!min.y) || min.y > result[0]);
            if((!min.z) || min.z > result[0]);
            if((!max.x) || max.x < result[0]);
            if((!max.y) || max.y < result[0]);
            if((!max.z) || max.z < result[0]);
            return result;
        })};
        transformedObjects[index].bounds = {min:min, max:max};
    });
    var chunk = this.chunk;
    return function(x, y, z){
        var offset = x*32*32 + y*32 + z;
        if(chunk[offset]) return chunk[offset];
        var result = 0;
        transformedObjects.forEach(function(o){
            if(o.buildGenerator || o.generator){
                result = (o.generator || (o.generator = o.buildGenerator(context)))(x, y, z, 0);
                return;
            }
            if(result) return;
            var b = o.bounds;
            if(
                x >= b.min.x &&
                x <= b.max.x &&
                y >= b.min.y &&
                y <= b.max.y &&
                z >= b.min.z &&
                z <= b.max.z
            ){
                var matching = o.geometry.filter(function(coord){
                    return x == coord[0] && y == coord[1] && z == coord[2];
                });
                if(matching[0]) result = matching[0][3] || 1;
            }
        });
        //console.log('@@', result);
        return result;
    }
}

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
        }
        if(biome.groundGeometry){
            biome.ground = function(subX, subY, subZ, context){
                return biome.groundGeometry(subX, subY, subZ, context).calculated(context);
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

function generateSubmesh(x, y, z, subgen){
    var data = new Int8Array(32*32*32);
    var xOff = 32 * 32;
    yOff = 32;
    var xPart;
    var yPart;
    var gen = subgen(x, y, z);
    for(var x=0; x < 32; x++ ){
        xPart = x * xOff;
        for(var y=0; y < 32; y++ ){
            yPart = y * yOff;
            for(var z=0; z < 32; z++ ){
                data[xPart + yPart + z] = gen(x, y, z);
            }
        }
    }
    return data;
}

BiomeReducer.prototype.buildGenerator = function(algorithm, offsets){
    var fn;
    if(!offsets) offsets = {};
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

    result.generateSubmesh = function(x, y, z){
        var selection = getSelection(x, y, z);
        var selectedBiomes = biomes[selection.rarity];
        var index = (
            selection.index + ( offsets[selection.rarity] || 0)
        ) % selectedBiomes.length; //wraparound
        var biome = selectedBiomes[index];
        if(biome.groundGeometry && y === 0){
            //we can optimize!
            var generator = biome.groundGeometry(x, y, z, selection).integrated(selection);
            return generator();
        }else{
            return generateSubmesh(x, y, z, result);
        }
    }

    return result;
}

module.exports = BiomeReducer;
