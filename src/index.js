window.addEventListener('load', () => {
  let context;
  let bufferLoader;
  let gain;
  let delay;
  let source;
  const pannerOptions = { pan: 0 };
  let panner;

  function init() {
    context = new AudioContext();
    gain = context.createGain()
    delay = context.createDelay()
    panner = new StereoPannerNode(context, pannerOptions)
    console.log(gain)

    bufferLoader = new BufferLoader(
      context,
      [
        '../assets/Track_1.mp3',
      ],
      finishedLoading
    );

    bufferLoader.load();
  }

  function finishedLoading(bufferList) {
    source = context.createBufferSource();
    source.buffer = bufferList[0];

    source.connect(delay).connect(panner).connect(gain).connect(context.destination)

    source.start(0);
  }

  function stop() {
    source.stop()
  }

  document.querySelector('.btn-play').addEventListener('click', () => {
    init()
  })

  document.querySelector('.effect--control-gain').addEventListener('input', (e) => {
    const value = e.target.value
    gain.gain.setValueAtTime(value, context.currentTime)
    document.querySelector('.effect--gain').querySelector('.effect--value').innerText = value
  })

  document.querySelector('.effect--control-delay').addEventListener('input', (e) => {
    const value = e.target.value
    delay.delayTime.setValueAtTime(value, context.currentTime)
    document.querySelector('.effect--delay').querySelector('.effect--value').innerText = value
  })

  document.querySelector('.effect--control-panner').addEventListener('input', (e) => {
    const value = e.target.value
    panner.pan.setValueAtTime(value, context.currentTime)
    document.querySelector('.effect--panner').querySelector('.effect--value').innerText = value
  })

  document.querySelector('.btn-stop').addEventListener('click', () => {
    stop()
  })
})
