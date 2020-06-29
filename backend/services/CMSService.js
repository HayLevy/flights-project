var createCountMin = require("../models/count-min-sketch.js")
var sketch = createCountMin()
const {
    to
  } = require('await-to-js');
const CMSService = {
    getMax: function () {
        //Check the insert to the sketch
        /*for(let i=0;i<30;i++)
            sketch.update("c", 1)
        
        sketch.update("b", 1)
        sketch.update("b", 1)
        
        for(let i=0;i<334;i++)
            sketch.update("b", 1)
        
        for(let i=0;i<10;i++)
            sketch.update("c", 1)

        var x = sketch.toJSON()
        var y = createCountMin()
        y.fromJSON(x)*/

        console.log("sketch.getMaximumKey : " + sketch.getMaximumKey());
        return sketch.getMaximumKey();

        
    },
    updateKey:async function(key){
        sketch.update(key._id,1);
    },

    getSketch:function(){
        return sketch;
    }
};

module.exports = CMSService;


