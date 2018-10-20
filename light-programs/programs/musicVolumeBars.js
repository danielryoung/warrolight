const SoundBasedFunction = require("./../base-programs/SoundBasedFunction");
const ColorUtils = require("./../utils/ColorUtils");
const _ = require('lodash');

module.exports =  class Func extends SoundBasedFunction{
  constructor(config, leds) {
    super(config, leds);
    this.volPromedio = 0;
  }

  start(config, draw, done){
    this.lastVolume = new Array(this.numberOfLeds+1).join('0').split('').map(() => [0,0,0]);
    this.time = 0;
    this.maxVolume = 0;

    super.start(config, draw, done)
  }

  // Override parent method
  drawFrame(draw, done){
    this.time += this.config.speed;

    let vol = this.averageRelativeVolume*this.config.multiplier*1.5;
    this.volPromedio = (vol+2*this.volPromedio)/3


    for(let i=0;i<this.numberOfLeds;i++) {
      let newColor = [0,0,0];
      if(i < (this.numberOfLeds)*this.volPromedio && (Math.ceil(i/3)*3)%(Math.round(this.numberOfLeds/10))){
        let tone = 0.35;
        if((i/this.numberOfLeds) > 0.5){
          tone = 0.25;
        }
        if((i/this.numberOfLeds) > 0.7){
          tone = 0;
        }
        newColor = ColorUtils.HSVtoRGB(tone, 1, Math.min(1, vol*vol));
      }
      this.lastVolume[i] = newColor;
    }

    draw(this.lastVolume);
    done();
  }

  static presets(){
    return {
    }
  }

  // Override and extend config Schema
  static configSchema(){
    let res = super.configSchema();
    res.multiplier = {type: Number, min: 0, max: 2, step: 0.01, default: 1};
    return res;
  }
}