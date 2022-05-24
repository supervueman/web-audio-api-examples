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

  async function getAudioStream() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
        latency: 0
      }
    });

    const lineInSource = context.createMediaStreamSource(stream);

    console.log(lineInSource)

    gain = context.createGain({
      gain: 0.5
    })

    delay = context.createDelay()
    distortion = audioCtx.createWaveShaper()
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

    lineInSource
      .connect(delay)
      .connect(panner)
      .connect(gain)
      .connect(biquadFilterLowPass)
      .connect(biquadFilterHighPass)
      .connect(context.destination);

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