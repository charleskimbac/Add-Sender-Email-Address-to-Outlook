/*
"https://outlook.live.com/mail/*" not supported. yet..?

potential new features:
UI (when clicking extension)
  changing min/max font sizes
  only show what's after the @
max name or address length until truncated
only show what's after the @

PSA:
only works on archive, inbox, deleted-items folders
*/


//begin
window.addEventListener('load', function(){
  setTimeout(function() { //mails arent loaded yet
    doNav();
    start();


  }, 1000); // 1000 milliseconds = 1 second
});

//starts appendEmailAddresses
function start(){
  doDivs();
  doScrollbar();

  setTimeout(appendEmailAddresses, 1000); //for users with <12 emails, last email always loads late
}

//find nav panel; when clicked, load start again
function doNav(){
  const nav = document.querySelector("[aria-label='Navigation pane']");

  if (nav != null){
    console.log("nav found");
    nav.addEventListener("click", function(){
      setTimeout(start, 100); //needs time to load
    });
  }
  else {
    console.log("nav not found");
    waitForLoad(doNav);
  }
}

function doDivs(){
  divs = appendEmailAddresses();
  
  if (divs.length == 0){
    console.log("divs not found");
    waitForLoad(doDivs);
  }
  else {
    console.log("divs found");
  }
}

//finds scrollbar, scrolling=appendEmailAddresses; rem: scrollbar element will disappear if user has a folder of <12 emails
function doScrollbar(){
  const scrollbar = document.querySelector(".customScrollBar.jEpCF");

  if (scrollbar != null){
    console.log("scrollbar found");
    scrollbar.addEventListener("scroll", function() {
      debounce(appendEmailAddresses, 100); // time for scroll inactivity
    });
  }
  else { //scrollbar = null
    console.log("scrollbar not found");
    waitForLoad(doScrollbar);
  }
}

//waits, then calls function again to find element
function waitForLoad(doThis){ 
  setTimeout(function() { 
    doThis();
  }, 2000); // 1000 milliseconds = 1 second
}

//wait for no more scrolling to execute appendEmailAddresses
let timeoutId;
function debounce(func, delay) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(func, delay);
}

//main
function appendEmailAddresses(){
  const emailSenderLines = document.querySelectorAll("div.ESO13.gy2aJ.CYQyC.Ejrkd");

  emailSenderLines.forEach((line) => {
    const senderLine = line.children[0];
    const address = senderLine.title;

    if (!senderLine.innerHTML.includes(address)) {
      const span = document.createElement("span");
      span.innerHTML = " &lt;" + address + "&gt;";
      span.style = "font-size: 12px; color: gray;";

      senderLine.appendChild(span);
    }
  });

  return emailSenderLines;
}