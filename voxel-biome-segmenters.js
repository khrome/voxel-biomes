var primes = require('primes');

var Segmenters = {};

var primelist = primes(1000);
var comesAfter = function(item, list){
    var result = -1;
    list.forEach(function(listItem, index){
        if(item > listItem) result = index
    });
    return result;
}

// creates a dense center of rares at world origin
Segmenters.primes = function(fn){
    var intersector = fn || function(a, b){
        return Math.max(a, b);
    }
    return function(x, y, z){
        var xIn = primelist.indexOf(Math.abs(x));
        var zIn = primelist.indexOf(Math.abs(z));
        var xPos;
        var zPos;
        if(xIn === -1 && zIn === -1){
            xPos = comesAfter(x, primelist);
            zPos = comesAfter(z, primelist);
            return {
                type : 'common',
                index: intersector(xPos, zPos)
            }
        }
        if(xIn === -1) return { type : 'uncommon', index: zIn };
        if(zIn === -1) return { type : 'uncommon', index: xIn };
        return {
            type : 'rare',
            index: intersector(xIn, zIn)
        }
    }
}

Segmenters.modulo = function(numA, numB, fn){
    var intersector = fn || function(a, b){
        return Math.max(a, b);
    }
    var numX = numA;
    var numY = numB || numA;
    return function(x, y, z){
        var remX = x % numX;
        var remZ = z % numY;
        var posX = Math.floor(x / numX);
        var posZ = Math.floor(z / numY);
        if(remX === 0 && remZ === 0){
            return {
                type : 'common',
                index: intersector(xPos, zPos)
            }
        }
        if(remX === 0) return { type : 'uncommon', index: posX };
        if(remZ === 0) return { type : 'uncommon', index: posZ };
        return {
            type : 'rare',
            index: intersector(xPos, zPos)
        }
    }
}
module.exports = Segmenters;
