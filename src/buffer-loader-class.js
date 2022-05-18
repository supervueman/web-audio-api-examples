class BufferLoader {
  context
  urlList
  onload
  bufferList = new Array();
  loadCount = 0;

  constructor(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
  }

  load() {
    this.urlList.forEach((url, i) => {
      this.loadBuffer(url, i);
    })
  }

  loadBuffer(url, index) {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    const loader = this;

    request.onload = function () {
      loader.context.decodeAudioData(
        request.response,
        function (buffer) {
          if (!buffer) {
            alert('error decoding file data: ' + url);
            return;
          }
          loader.bufferList[index] = buffer;
          if (++loader.loadCount == loader.urlList.length) {
            loader.onload(loader.bufferList);
          }
        },
        function (error) {
          console.error('decodeAudioData error', error);
        }
      );
    }

    request.onerror = function () {
      alert('BufferLoader: XHR error');
    }

    request.send();
  }
}