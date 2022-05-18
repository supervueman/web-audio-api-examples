window.addEventListener('load', () => {
  let context;
  let bufferLoader;

  function init() {
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
    const source = context.createBufferSource();
    source.buffer = bufferList[0];

    source.connect(context.destination);
    source.start(0);
  }

  document.querySelector('.btn-init').addEventListener('click', () => {
    init()
  })
})
