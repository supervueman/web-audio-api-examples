window.addEventListener('load', () => {
  let context;
  let bufferLoader;
  let gain;
  let delay;
  let source;

  function init() {
    context = new AudioContext();
    gain = context.createGain()
    delay = context.createDelay()
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
    source.connect(delay)
    delay.connect(gain)
    delay.connect(context.destination)

    source.connect(gain)
    gain.connect(context.destination)

    source.buffer = bufferList[0];

    source.connect(context.destination);
    source.start(0);
  }

  function stop() {
    source.stop()
  }

  document.querySelector('.btn-play').addEventListener('click', () => {
    init()
  })

  document.querySelector('.effect--control-gain').addEventListener('input', (e) => {
    const value = e.target.value / 10 - 1
    gain.gain.setValueAtTime(value, context.currentTime)
    document.querySelector('.effect--gain').querySelector('.effect--value').innerText = value
  })

  document.querySelector('.effect--control-delay').addEventListener('input', (e) => {
    const value = e.target.value / 100
    delay.delayTime.setValueAtTime(value, context.currentTime)
    document.querySelector('.effect--delay').querySelector('.effect--value').innerText = value
  })

  document.querySelector('.btn-stop').addEventListener('click', () => {
    stop()
  })
})
