window.addEventListener('load', () => {
  let context;
  let bufferLoader;
  let gain;
  let delay;

  function init() {
    context = new AudioContext();
    gain = context.createGain()
    delay = context.createDelay(1)
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
    const source = context.createBufferSource();
    source.connect(gain)
    source.connect(delay)
    delay.connect(context.destination)
    gain.connect(context.destination)
    gain.gain.setValueAtTime(0, context.currentTime)

    console.log(context.destination)
    source.buffer = bufferList[0];
    console.log(bufferList)

    source.connect(context.destination);
    source.start(0);
  }

  document.querySelector('.btn-init').addEventListener('click', () => {
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
})
