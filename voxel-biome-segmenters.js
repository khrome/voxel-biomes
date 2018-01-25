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
        var absX = Math.abs(x);
        var absZ = Math.abs(z);
        var xIn = primelist.indexOf(absX);
        var zIn = primelist.indexOf(absZ);
        var xPos;
        var zPos;
        if(xIn === -1 && zIn === -1){
            xPos = comesAfter(absX, primelist);
            if(xPos === -1) xPos = 0;
            zPos = comesAfter(absZ, primelist);
            if(zPos === -1) zPos = 0;
            return {
                rarity : 'common',
                index: intersector(xPos, zPos)
            }
        }
        if(xIn === -1) return { rarity : 'uncommon', orientation: 'x', index: zIn };
        if(zIn === -1) return { rarity : 'uncommon', orientation: 'z', index: xIn };
        return {
            rarity : 'rare',
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
                rarity : 'rare',
                index: intersector(xPos, zPos)
            }
        }
        if(remX === 0) return { rarity : 'uncommon', orientation: 'x', index: posX };
        if(remZ === 0) return { rarity : 'uncommon', orientation: 'z', index: posZ };
        return {
            rarity : 'common',
            index: intersector(xPos, zPos)
        }
    }
}
module.exports = Segmenters;
