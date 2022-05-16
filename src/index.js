window.addEventListener('load', async () => {
  const context = new AudioContext()
  const gain = new GainNode(context)
  const delay = new DelayNode(context)
  const source = new MediaElementAudioSourceNode(context, { mediaElement: document.querySelector('audio') })

  gain.gain.value = 0.5

  source.connect(context.destination)
  source.connect(delay)
  delay.connect(gain)
  gain.connect(context.destination)
})
