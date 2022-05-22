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

  const bqFiltersEnum = {
    lowpass: biquadFilterLowPass,
    highpass: biquadFilterHighPass
  }

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
      frequency: 350,
      gain: 1,
    })
    bqFiltersEnum.highpass = biquadFilterHighPass

    biquadFilterLowPass = new BiquadFilterNode(context, {
      type: 'lowpass',
      Q: 0.5,
      frequency: 300,
      gain: 1,
    })
    bqFiltersEnum.lowpass = biquadFilterLowPass

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

    source
      .connect(delay)
      .connect(panner)
      .connect(gain)
      .connect(biquadFilterLowPass)
      .connect(biquadFilterHighPass)
      .connect(context.destination)
    source.start(0, currentTime);
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

  function bgFilterChange(type) {
    const bgfilterDomEl = $('.effect--bqfilter')

    const filter = bgfilterDomEl.querySelector(`.effect--bqfilter-${type}`)

    const controlContainerFrequency = filter.querySelector('.effect--control-container-bqfilter-frequency')
    const controlContainerQ = filter.querySelector('.effect--control-container-bqfilter-q')
    const controlContainerGain = filter.querySelector('.effect--control-container-bqfilter-gain')

    const inputFrequency = controlContainerFrequency.querySelector('.effect--control')
    const inputQ = controlContainerQ.querySelector('.effect--control')
    const inputGain = controlContainerGain.querySelector('.effect--control')

    const valueDomFrequency = controlContainerFrequency.querySelector('.effect--value')
    const valueDomQ = controlContainerQ.querySelector('.effect--value')
    const valueDomGain = controlContainerGain.querySelector('.effect--value')

    inputFrequency.addEventListener('input', (e) => {
      const value = e.target.value
      bqFiltersEnum[type].frequency.setValueAtTime(value, context.currentTime)
      valueDomFrequency.innerText = value
    })

    inputQ.addEventListener('input', (e) => {
      const value = e.target.value
      bqFiltersEnum[type].Q.setValueAtTime(value, context.currentTime)
      valueDomQ.innerText = value
    })

    inputGain.addEventListener('input', (e) => {
      const value = e.target.value
      bqFiltersEnum[type].gain.setValueAtTime(value, context.currentTime)
      valueDomGain.innerText = value
    })
  }

  bgFilterChange('lowpass')
  bgFilterChange('highpass')
})
