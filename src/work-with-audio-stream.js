window.addEventListener('load', () => {
  let context;
  let gain;
  let delay;
  const pannerOptions = { pan: 0 };
  let panner;
  let biquadFilterHighPass;
  let biquadFilterLowPass;
  let distortion

  const bqFiltersEnum = {
    lowpass: biquadFilterLowPass,
    highpass: biquadFilterHighPass
  }

  document.querySelector('.btn-play').addEventListener('click', () => {
    context = new AudioContext()

    getAudioStream()
  })

  function makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  };

  async function getAudioStream() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
        latency: 0
      }
    });

    const lineInSource = context.createMediaStreamSource(stream)

    console.log(lineInSource)

    gain = context.createGain({
      gain: 0.5
    })

    delay = context.createDelay()

    distortion = context.createWaveShaper()
    distortion.curve = makeDistortionCurve(600)
    distortion.oversample = '4x'

    panner = new StereoPannerNode(context, pannerOptions)

    biquadFilterHighPass = new BiquadFilterNode(context, {
      type: 'highpass',
      Q: 1,
      frequency: 0,
      gain: 1,
    })
    bqFiltersEnum.highpass = biquadFilterHighPass

    biquadFilterLowPass = new BiquadFilterNode(context, {
      type: 'lowpass',
      Q: 1,
      frequency: 20000,
      gain: 1,
    })
    bqFiltersEnum.lowpass = biquadFilterLowPass

    splitter = context.createChannelSplitter();
    merger = context.createChannelMerger();

    lineInSource
      .connect(splitter)
      .connect(merger)
      .connect(delay)
      .connect(panner)
      .connect(gain)
      .connect(biquadFilterLowPass)
      .connect(biquadFilterHighPass)
      .connect(distortion)
      .connect(context.destination);

    splitter.connect(merger, 0, 0)
    splitter.connect(merger, 0, 1)

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

    console.log(stream)
  }
})