window.addEventListener('load', () => {
  let context;
  let bufferLoader;

  function init() {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

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
    // Create two sources and play them both together.
    const source1 = context.createBufferSource();
    source1.buffer = bufferList[0];

    source1.connect(context.destination);
    source1.start(0);
  }

  document.querySelector('.btn-init').addEventListener('click', () => {
    init()
  })
})
