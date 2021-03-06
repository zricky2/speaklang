var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var englishphr = [
  'I love to sing because it\'s fun',
  'where are you going',
  'can I call you tomorrow',
  'why did you talk while I was talking',
  'she enjoys reading books and playing games',
  'where are you going',
  'have a great day',
  'she sells seashells on the seashore',
  'thanks so much for the birthday money',
  'Excuse me do you know what time it is',
  'Thanks so much for cooking dinner. I really appreciate it',
  'Economics affects everyone’s lives',
  'Learning about economic concepts can help you',
  'understand the news',
  'make financial decisions',
  'shape public policy',
  'I see the world in a new way.'

];

var chinesephr = [
  '正确',
  '错误',
  '劳驾',
  '对不起',
  '您会讲英语吗',
  '我只会讲一点中文',
  '我不明白',
  '很高兴认识您',
  '我喜欢你',
  '我爱你',
  '中国茶',
  '威胁',
  '谦虚',
  '压力',
  '竹子',
  '綠色',
  '生命力',
  '强',
  '细心'
];

var phrasePara = document.querySelector('.phrase');
var resultPara = document.querySelector('.result');
var diagnosticPara = document.querySelector('.output');

var testBtn = document.querySelector('button');
var english = document.querySelector('#english');
var chinese = document.querySelector('#chinese');

var lang;
var phrases;

function randomPhrase() {
  var number = Math.floor(Math.random() * phrases.length);
  return number;
}

function testSpeech() {

  if (english.checked) {
    lang = "en";
    phrases = englishphr;
  } else if (chinese.checked) {
    lang = "zh-Hans";
    phrases = chinesephr;
  } else {
    alert("Select a language");
    return;
  }
  testBtn.disabled = true;
  testBtn.textContent = 'In progress';
  console.log(phrases);

  var phrase = phrases[randomPhrase()];
  // To ensure case consistency while checking with the returned output text
  phrase = phrase.toLowerCase();
  phrasePara.textContent = phrase;
  resultPara.textContent = 'Right or wrong?';
  resultPara.style.background = 'rgba(0,0,0,0.2)';
  diagnosticPara.textContent = '';

  var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase + ';';
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = lang;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function (event) {

    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object 
    var speechResult = event.results[0][0].transcript.toLowerCase();
    diagnosticPara.textContent = 'You said: ' + speechResult + '.';
    if (speechResult === phrase) {
      resultPara.textContent = 'Correct';
      resultPara.style.background = 'green';
    } else {
      resultPara.textContent = 'That didn\'t sound right.';
      resultPara.style.background = 'red';
    }

    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function () {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
  }

  recognition.onerror = function (event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }

  recognition.onaudiostart = function (event) {
    //Fired when the user agent has started to capture audio.
    console.log('SpeechRecognition.onaudiostart');
  }

  recognition.onaudioend = function (event) {
    //Fired when the user agent has finished capturing audio.
    console.log('SpeechRecognition.onaudioend');
  }

  recognition.onend = function (event) {
    //Fired when the speech recognition service has disconnected.
    console.log('SpeechRecognition.onend');
  }

  recognition.onnomatch = function (event) {
    //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
    console.log('SpeechRecognition.onnomatch');
  }

  recognition.onsoundstart = function (event) {
    //Fired when any sound — recognisable speech or not — has been detected.
    console.log('SpeechRecognition.onsoundstart');
  }

  recognition.onsoundend = function (event) {
    //Fired when any sound — recognisable speech or not — has stopped being detected.
    console.log('SpeechRecognition.onsoundend');
  }

  recognition.onspeechstart = function (event) {
    //Fired when sound that is recognised by the speech recognition service as speech has been detected.
    console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function (event) {
    //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
    console.log('SpeechRecognition.onstart');
  }
}
//runs after clicking the button
testBtn.addEventListener('click', testSpeech);