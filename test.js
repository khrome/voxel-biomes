(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([
            'mocha',
            'should',
            'voxel-generators',
            'voxel-generators/objects/trees',
            'voxel-generators/objects/houses',
            './voxel-biomes',
            './voxel-biome-segmenters',
            './biomes/forest'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(
            require('mocha'),
            require('should'),
            require('voxel-generators'),
            require('voxel-generators/objects/trees'),
            require('voxel-generators/objects/houses'),
            require('./voxel-biomes'),
            require('./voxel-biome-segmenters'),
            require('./biomes/forest')
        );
    } else {
        throw new Error('global testing not supported!');
    }
}(this, function (mocha, should, Geometry, Trees, Houses, Biomes, Segmenters){
    var Random = Geometry.Random;
    var makeTrees = function(){
        var trees = new Trees();
        trees.add({ x:5, y:0, z:5, height: 20 });
        trees.add({ x:5, y:0, z:10, height: 20 });
        trees.add({ x:10, y:0, z:5, height: 20 });
        trees.add({ x:10, y:0, z:10, height: 20 });
        return trees;
    }

    var buildChunk = function(chunk, iterator){
        var index;
        for(var x=0; x< 32; x++){
            for(var y=0; y< 32; y++){
                for(var z=0; z< 32; z++){
                    index = x*32*32 + y*32 + z
                    if(!chunk[index]) chunk[index] = iterator(x, y, z);
                    if(typeof chunk[index] === 'function') chunk[index] = chunk[index]();
                }
            }
        }
    }

    var chunksShouldBeEqual = function(chunkA, chunkB){
        for(var lcv=0; lcv<chunkA.length; lcv++){
            should.equal(
                chunkA[lcv],
                chunkB[lcv],
                'Expect chunks to be equal at position '+
                    lcv+', but found '+chunkA[lcv]+
                    ' and '+chunkB[lcv]+"\n"+chunkA.slice(lcv-10, lcv+10)+"\n"+chunkB.slice(lcv-10, lcv+10)
            );
            should.exist(chunkA[lcv]);
            should.exist(chunkB[lcv]);
        }
    }

    var chunkIsntEmpty = function(chunk){
        var occupied = 0;
        for(var lcv=0; lcv<chunk.length; lcv++){
            if(chunk[lcv] !== 0) occupied++;
        }
        occupied.should.not.equal(0, 'Chunk Should contain non-empty blocks');
    }


    var testSeed = 'just_some_seed';

    //x, y, z - but like 3d engines, Y is the rise axis

    var locations = [
        [0, 0, 0],
        [1, 0, 1],
        [-1, -1, 0],
        [10, -10, 0]
    ]

    describe('voxel-biomes', function(){
        describe('biome renders correctly', function(){
            var builder;
            var generator;

            before(function(){
                builder = new Biomes();
                builder.addBiome(require('./biomes/hills'));
                builder.addBiome(require('./biomes/badlands'));
                builder.addBiome(require('./biomes/forest'));
                builder.addBiome(require('./biomes/woods'));
                builder.addBiome(require('./biomes/village'));
                builder.addBiome(require('./biomes/temple'));
                builder.addBiome(require('./biomes/megalith'));
                builder.addBiome(require('./biomes/plains'));
                builder.addBiome(require('./biomes/field'));
                builder.addBiome(require('./biomes/desert'));
                generator = builder.buildGenerator(Biomes.Segmenters.primes());
            });

            locations.forEach(function(location){
                it('renders '+location.join(', '), function(){
                    var submesh = generator.submesh(location[0], location[1], location[2]);
                    if(submesh.generate) submesh = submesh.generate();
                    chunkIsntEmpty(submesh);
                });
            });

        });
    });
}));
