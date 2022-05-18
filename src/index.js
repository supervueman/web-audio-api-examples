window.addEventListener('load', () => {
  let context;
  let bufferLoader;
  let gain;

  function init() {
    context = new AudioContext();
    gain = context.createGain()
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
    gain.connect(context.destination)
    gain.gain.setValueAtTime(0, context.currentTime)

    console.log(context.destination)
    source.buffer = bufferList[0];

    source.connect(context.destination);
    source.start(0);
  }

  document.querySelector('.btn-init').addEventListener('click', () => {
    init()
  })

  document.querySelector('.input-gain').addEventListener('input', (e) => {
    const gainValue = e.target.value / 10 - 1

    gain.gain.setValueAtTime(gainValue, context.currentTime)
  })
})
