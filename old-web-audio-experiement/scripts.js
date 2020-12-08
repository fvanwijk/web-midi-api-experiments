var audioCtx = new window.AudioContext();

// Oscillator node
var oscillator = audioCtx.createOscillator();
oscillator.type = 'sine';
oscillator.frequency.value = 440;
oscillator.start();

// Gain node
var gainNode = audioCtx.createGain();
gainNode.gain.value = 0.2;

// Analyser
var analyser = audioCtx.createAnalyser();

// Connect the things
oscillator.connect(gainNode);
//gainNode.connect(analyser);
gainNode.connect(audioCtx.destination);

// Canvas
var canvas = document.querySelector('.visualizer');
var canvasCtx = canvas.getContext("2d");

// The App component
new Vue({
  el: '#app',
  data: {
    oscillator: oscillator,
    gainNode: gainNode
  },
  computed: {
    freq: function () {
      console.log(this.oscillator);
      return this.oscillator;
      //return Math.floor(this.oscillator.frequency.value);
    }
  },
  methods: {
    toggleMute: function () {
      gainNode.gain.value = gainNode.gain.value ? 0 : 0.2;
    },
    setFrequency: function (e) {
      this.oscillator.frequency.value = e.target.value / 100 * 1760;
    },
    setGain: function (e) {
      this.gainNode.gain.value = e.target.value / 100;
    }
  }
});

var visualSelect = document.querySelector('.visualSelect');
var drawVisual;

visualSelect.onchange = function() {
  window.cancelAnimationFrame(drawVisual);
  visualize();
};
//visualize();

function visualize() {
  WIDTH = canvas.width;
  HEIGHT = canvas.height;

  var visualSetting = visualSelect.value;

  if(visualSetting == "sinewave") {
    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount; // half the FFT value
    var dataArray = new Uint8Array(bufferLength); // create an array to store the data

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {

      drawVisual = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray); // get waveform data and put it into the array created above

      canvasCtx.fillStyle = 'rgb(200, 200, 200)'; // draw wave with canvas
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

      canvasCtx.beginPath();

      var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;

        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height/2);
      canvasCtx.stroke();
    }

    draw();
  } else if(visualSetting == "frequencybars") {
    analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {
      drawVisual = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      var barWidth = (WIDTH / bufferLength) * 2.5;
      var barHeight;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
        canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

        x += barWidth + 1;
      }
    }

    draw();
  } else if(visualSetting == "off") {
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.fillStyle = "red";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  }

}


navigator.webkitGetUserMedia({ audio: true },
  function (stream) {


    var source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    visualize();


  }, function(err) {
    console.log('The following gUM error occured: ' + err);
  });
