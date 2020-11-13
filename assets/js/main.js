/*eslint-env es6*/
/*eslint-env es7*/
/*global window */
/*global document */
/*global alert */

window.addEventListener('DOMContentLoaded', scrollToTop(), false);

function scrollToTop() {
   const btnToTop = document.getElementById("btnToTop");
   btnToTop.onclick = function () {
      window.scrollTo({
         top: 0,
         left: 0,
         behavior: 'smooth'
      });
   }
}

// When the user scrolls down 150px from the top of the document, show the button
window.onscroll = function () {
   scrollFunction()
};

function scrollFunction() {
   const btnToTop = document.getElementById("btnToTop");
   if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
      btnToTop.style.display = "block";
   } else {
      btnToTop.style.display = "none";
   }
}

window.addEventListener('DOMContentLoaded', toggleNav(), false);

function toggleNav() {
   const nav_panel = document.getElementById('nav-panel');
   document.getElementById('toggle-nav').addEventListener("click", function () {

      nav_panel.style.display =
         nav_panel.style.display == "" ? "block" : "";
      window.scrollTo(0, 0);

   });
}

window.addEventListener('DOMContentLoaded', setDayTheme(), false);

function setDayTheme() {
   const day = document.getElementById('day');
   day.onclick = function () {
      const bodyRoot = document.getElementById('body-root');
      const classes = bodyRoot.classList;
      classes.replace('high-contrast', 'day');
      classes.replace('night', 'day');
   }
}

window.addEventListener('DOMContentLoaded', setNighTheme(), false);

function setNighTheme() {
   const night = document.getElementById('night');
   night.onclick = function () {
      const bodyRoot = document.getElementById('body-root');
      const classes = bodyRoot.classList;
      classes.replace('high-contrast', 'night');
      classes.replace('day', 'night');
   }
}

window.addEventListener('DOMContentLoaded', setHighContrastTheme(), false);

function setHighContrastTheme() {
   const highContrast = document.getElementById('high-contrast');
   highContrast.onclick = function () {
      const bodyRoot = document.getElementById('body-root');
      const classes = bodyRoot.classList;
      classes.replace('night', 'high-contrast');
      classes.replace('day', 'high-contrast');
   }
}

window.addEventListener('DOMContentLoaded', addArticleListeners('nav-main'), false);
window.addEventListener('DOMContentLoaded', addArticleListeners('navbar'), false);

function addArticleListeners(elementId) {

   /**
    * set event listeners for main nav
    **/
   // set listeners for speakIt notes in the article
   const element = document.getElementById(elementId);
   const articles = element.querySelectorAll('[data-article]');
   for (const article of articles) {

      if (0 !== article.dataset.article.length) {

         article.addEventListener('click', function (e) {
            showArticle(e.target.dataset.article);
         });

      } else {
         alert("oops! this should not happen. Include a message for article not found!!!");
      }

   }
}

showArticle('home-page');

function showArticle(articleId) {
   // from hidden section getElementById and clone and replace article placeholder
   let article = document.getElementById(articleId).cloneNode(true);

   article = setAssets(article);

   // replace the article-container with selected article
   document.getElementById('article-container')
      .replaceChild(article, document.querySelector('#article-container > article'));
   // add listeners
   addArticleListeners(articleId);
   addSpeachListeners(articleId);

   window.scrollTo(0, 0);

}

// for offline assets

/*global navigator */
function setAssets(article) {
   const imagesData = article.querySelectorAll('[data-image]');
   for (const imageData of imagesData) {

      let src = '';
      navigator.onLine ? src = imageData.dataset.cdnSrc : src = imageData.dataset.localSrc;

      const image = document.createElement("img");
      image.src = src;
      image.alt = imageData.dataset.image;
      image.className = imageData.dataset.class;

      const parentDiv = imageData.parentNode;
      parentDiv.replaceChild(image, imageData);
   }

   return article;
}

/*global speechSynthesis */
window.addEventListener('DOMContentLoaded', addSpeachListeners('nav-main'), false);
populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
   speechSynthesis.onvoiceschanged = populateVoiceList;
}

function addSpeachListeners(elementId) {
   const ele = document.getElementById(elementId);
   const speeches = ele.querySelectorAll("svg[data-speak='true']");

   for (const speech of speeches) {
      speech.addEventListener(speech.dataset.event, function () {
         speakIt(document.getElementById(speech.dataset.speakId).innerText);
      })
   }
}

/*global SpeechSynthesisUtterance */
function speakIt(message) {
   const msg = new SpeechSynthesisUtterance(message);
   const voices = window.speechSynthesis.getVoices();
   msg.voice = voices[document.querySelector("select#voiceSelect").selectedIndex];
   window.speechSynthesis.speak(msg);
}

function populateVoiceList() {

   if (typeof speechSynthesis === 'undefined') {
      return;
   }

   const voices = speechSynthesis.getVoices();

   for (let i = 0; i < voices.length; i++) {
      const option = document.createElement('option');
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

      if (voices[i].default) {
         option.textContent += ' *';
      }

      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      document.getElementById("voiceSelect").appendChild(option);
   }
}

function clock() {
   const now = new Date();
   const ctx = document.getElementById('canvasClock').getContext('2d');
   ctx.save();
   ctx.clearRect(0, 0, 150, 150);
   ctx.translate(75, 75);
   ctx.scale(0.4, 0.4);
   ctx.rotate(-Math.PI / 2);
   ctx.strokeStyle = 'black';
   ctx.fillStyle = 'white';
   ctx.lineWidth = 8;
   ctx.lineCap = 'round';

   // Hour marks
   ctx.save();
   for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.rotate(Math.PI / 6);
      ctx.moveTo(100, 0);
      ctx.lineTo(120, 0);
      ctx.stroke();
   }
   ctx.restore();

   // Minute marks
   ctx.save();
   ctx.lineWidth = 5;
   for (let i = 0; i < 60; i++) {
      if (i % 5 != 0) {
         ctx.beginPath();
         ctx.moveTo(117, 0);
         ctx.lineTo(120, 0);
         ctx.stroke();
      }
      ctx.rotate(Math.PI / 30);
   }
   ctx.restore();

   const sec = now.getSeconds();
   const min = now.getMinutes();
   let hr = now.getHours();
   hr = hr >= 12 ? hr - 12 : hr;

   ctx.fillStyle = 'black';

   // write Hours
   ctx.save();
   ctx.rotate(hr * (Math.PI / 6) + (Math.PI / 360) * min + (Math.PI / 21600) * sec);
   ctx.lineWidth = 14;
   ctx.beginPath();
   ctx.moveTo(-20, 0);
   ctx.lineTo(80, 0);
   ctx.stroke();
   ctx.restore();

   // write Minutes
   ctx.save();
   ctx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec);
   ctx.lineWidth = 10;
   ctx.beginPath();
   ctx.moveTo(-28, 0);
   ctx.lineTo(112, 0);
   ctx.stroke();
   ctx.restore();

   // Write seconds
   ctx.save();
   ctx.rotate(sec * Math.PI / 30);
   ctx.strokeStyle = '#D40000';
   ctx.fillStyle = '#D40000';
   ctx.lineWidth = 6;
   ctx.beginPath();
   ctx.moveTo(-30, 0);
   ctx.lineTo(83, 0);
   ctx.stroke();
   ctx.beginPath();
   ctx.arc(0, 0, 10, 0, Math.PI * 2, true);
   ctx.fill();
   ctx.beginPath();
   ctx.arc(95, 0, 10, 0, Math.PI * 2, true);
   ctx.stroke();
   ctx.fillStyle = 'rgba(0, 0, 0, 0)';
   ctx.arc(0, 0, 3, 0, Math.PI * 2, true);
   ctx.fill();
   ctx.restore();

   ctx.beginPath();
   ctx.lineWidth = 14;
   ctx.strokeStyle = '#325FA2';
   ctx.arc(0, 0, 142, 0, Math.PI * 2, true);
   ctx.stroke();

   ctx.restore();

   window.requestAnimationFrame(clock);
}

window.requestAnimationFrame(clock);

/*global Image */
const sun = new Image();
const moon = new Image();
const earth = new Image();
const mobileWidth = 667;

function initSolar() {
   sun.src = 'https://cdn.glitch.com/3943c32b-ac0d-4285-afbf-c67ee5a851ca%2Fcanvas_sun.png?v=1572571113467';
   moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
   earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';

   window.requestAnimationFrame(drawSolar);

}

function drawSolar() {
   const ctx = document.getElementById('canvasSolar').getContext('2d');

   ctx.globalCompositeOperation = 'destination-over';
   ctx.clearRect(0, 0, 300, 300); // clear canvas

   ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
   ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
   ctx.save();
   ctx.translate(150, 150);

   // Earth
   const time = new Date();
   ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
   ctx.translate(105, 0);
   // ctx.fillRect(0, -12, 40, 24); // Shadow
   ctx.drawImage(earth, -12, -12);

   // Moon
   ctx.save();
   ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
   ctx.translate(0, 28.5);
   ctx.drawImage(moon, -3.5, -3.5);
   ctx.restore();

   ctx.restore();

   ctx.beginPath();
   ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
   ctx.stroke();

   ctx.drawImage(sun, 0, 0, 300, 300);

   if (document.documentElement.clientWidth > mobileWidth) {
      window.requestAnimationFrame(drawSolar);
   }

}

//const minWidth = 600;

window.addEventListener("resize", handleResize);

function handleResize() {

/*
   if (document.documentElement.clientWidth < minWidth) {
      document.getElementById('banner').style.display = "none";
      document.getElementById('mainContainer').style.paddingTop = "3em";
   } else {
      document.getElementById('banner').style.display = "block";
      document.getElementById('mainContainer').style.paddingTop = "1.25em";
   }
*/
   if (document.documentElement.clientWidth > mobileWidth) {

      document.getElementById('canvasSolar').style.display = "inline";
      initSolar();

      document.getElementById('canvasClock').style.display = "inline";
      clock();

   } else {
      document.getElementById('canvasSolar').style.display = "none";
      document.getElementById('canvasClock').style.display = "none";
   }


}
