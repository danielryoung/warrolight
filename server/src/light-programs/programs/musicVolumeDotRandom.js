const LightProgram = require("./../base-programs/LightProgram");
const ColorUtils = require("./../utils/ColorUtils");

module.exports = class MusicVolumeDotRandom extends LightProgram {

  init() {
    this.lastVolume = new Array(this.numberOfLeds + 1).fill([0, 0, 0]);
    this.time = 0;
    this.maxVolume = 0;

    this.onLeds = new Array(this.numberOfLeds).fill(false);
    this.assignLights();
  }

  assignLights() {
    let p = this.config.numberOfOnLeds / this.numberOfLeds;
    for (let i = 0; i < this.onLeds.length; i++) {
      this.onLeds[i] = Math.random() < p/this.geometry.density[i];
    }
    this.needingReshuffle = false;
  }

  // Override parent method
  drawFrame(leds, context) {
    let audio = context.audio;
    audio = audio.currentFrame || {};
    this.time += this.config.speed;

    let vol = (audio[this.config.soundMetric] || 0) * this.config.multiplier;

    // Como las luces tenues son MUY fuertes igual, a partir de cierto valor "las bajamos"
    if (vol < this.config.cutThreshold) {
      vol = 0;
      this.needingReshuffle = true;
    } else {
      if (this.needingReshuffle) {
        this.assignLights();
      }

      vol = (vol - this.config.cutThreshold) / (1 - this.config.cutThreshold);
    }

    let newVal = ColorUtils.HSVtoRGB(0, 0, Math.min(vol * vol, 1));

    for (let i = 0; i < this.numberOfLeds; i++) {
      if (this.onLeds[i]) {
        this.lastVolume[i] = newVal;
      } else {
        this.lastVolume[i] = [0, 0, 0];
      }
    }

    leds.forEach((v, i) => {
      leds[i] = this.lastVolume[i];
    });
  }

  static presets() {
    return {};
  }

  // Override and extend config Schema
  static configSchema() {
    let res = super.configSchema();
    res.multiplier = {type: Number, min: 0, max: 2, step: 0.01, default: 1};
    res.numberOfOnLeds = {type: Number, min: 1, max: 100, step: 1, default: 40};
    res.cutThreshold = {type: Number, min: 0, max: 1, step: 0.01, default: 0.45};
    res.soundMetric = {type: 'soundMetric', default: "bassFastPeakDecay"};
    return res;
  }
};
