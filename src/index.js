window.addEventListener('load', () => {
  let isPlay = false
  let context;
  let bufferLoader;
  let gain;
  let delay;
  let source;
  const pannerOptions = { pan: 0 };
  let panner;
  let currentTime = 0
  let biquadFilterHighPass;
  let biquadFilterLowPass;

  function init() {
    if (!context) {
      context = new AudioContext();
    }
    gain = context.createGain()
    delay = context.createDelay()
    panner = new StereoPannerNode(context, pannerOptions)
    biquadFilterHighPass = new BiquadFilterNode(context, {
      type: 'highpass',
      Q: 0.5,
      frequency: 3000,
      gain: 1,
    })
    biquadFilterLowPass = new BiquadFilterNode(context, {
      type: 'lowpass',
      Q: 0.5,
      frequency: 1000,
      gain: 1,
    })
    console.log(gain)

    bufferLoader = new BufferLoader(
      context,
      [
        '../assets/Track_1.mp3',
      ],
      createBuffer
    );

    bufferLoader.load();
  }

  function createBuffer(bufferList) {
    if (isPlay) {
      context.resume()
    }

    source = context.createBufferSource();
    console.log(source.playbackRate)
    source.buffer = bufferList[0];

    source.connect(delay).connect(panner).connect(gain).connect(biquadFilterHighPass).connect(biquadFilterLowPass).connect(context.destination)
    source.start(0, currentTime);

    console.log(context.currentTime)
  }

  function stop() {
    isPlay = false
    console.log(context.state)
    context.suspend()
    currentTime = context.currentTime
    console.log(currentTime)
    source.stop()
  }

  const $ = (attr) => {
    return document.querySelector(attr)
  }

  $('.effect--control-gain').addEventListener('input', (e) => {
    const value = e.target.value
    gain.gain.setValueAtTime(value, context.currentTime)
    $('.effect--gain').querySelector('.effect--value').innerText = value
  })

  $('.effect--control-delay').addEventListener('input', (e) => {
    const value = e.target.value
    delay.delayTime.setValueAtTime(value, context.currentTime)
    $('.effect--delay').querySelector('.effect--value').innerText = value
  })

  $('.effect--control-panner').addEventListener('input', (e) => {
    const value = e.target.value
    panner.pan.setValueAtTime(value, context.currentTime)
    $('.effect--panner').querySelector('.effect--value').innerText = value
  })

  $('.btn-play').addEventListener('click', () => {
    isPlay = true
    init()
  })

  $('.btn-stop').addEventListener('click', () => {
    stop()
  })
})
