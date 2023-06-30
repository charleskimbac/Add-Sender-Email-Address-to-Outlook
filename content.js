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

//starts ext
function start(){
  doDivs();
  doScrollbar();

  setTimeout(ext, 1000); //for users with <12 emails, last email always loads late
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
  divs = ext();
  
  if (divs.length == 0){
    console.log("divs not found");
    waitForLoad(doDivs);
  }
  else {
    console.log("divs found");
  }
  
}

//finds scrollbar, scrolling=ext; rem: scrollbar element will disappear if user has a folder of <12 emails
function doScrollbar(){
  const scrollbar = document.querySelector(".customScrollBar.jEpCF");

  if (scrollbar != null){
    console.log("scrollbar found");
    scrollbar.addEventListener("scroll", function() {
      debounce(ext, 100); // time for scroll inactivity
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

//wait for no more scrolling to execute ext
let timeoutId;
function debounce(func, delay) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(func, delay);
}

//main
function ext(){
  console.log("ext");
  const filteredDivs = document.querySelectorAll("" +
  'div[style*="position: absolute; left: 0px;"][style*="height: 81px"][style*="width: 100%;"][style*="top:"],' + //"common" emails
  'div[style*="position: absolute; left: 0px;"][style*="height: 118px"][style*="width: 100%;"][style*="top:"],' + //emails with "yesterday", "last week" headers
  'div[style*="position: absolute; left: 0px;"][style*="height: 116px"][style*="width: 100%;"][style*="top:"]' //emails with attachments
  );

  //console.log(filteredDivs);

  for (let i = 0; i < filteredDivs.length; i++) {
    //get element with the email address info
    const div = filteredDivs[i];
    if (div.getAttribute('style').includes("height: 118px")){ //(they have different paths)
      const child1 = div.childNodes[0];
      const child2 = child1.childNodes[1];
      const child3 = child2.childNodes[0];
      const child4 = child3.childNodes[0];
      const child5 = child4.childNodes[1];
      const child6 = child5.childNodes[1];
      const child7 = child6.childNodes[0];
      const child8 = child7.childNodes[0];
      const child9 = child8.childNodes[0];

      var change = child9;
    }
    else {
      const child1 = div.childNodes[0];
      const child2 = child1.childNodes[0];
      const child3 = child2.childNodes[0];
      const child4 = child3.childNodes[0];
      const child5 = child4.childNodes[1];
      const child6 = child5.childNodes[1];
      const child7 = child6.childNodes[0];
      const child8 = child7.childNodes[0];
      const child9 = child8.childNodes[0];

      var change = child9;
    }

    //console.log(change);

    if (change.getAttribute('style') == null){ //checks if address has already been appended (bc of prev scrolls)
      var address = change.getAttribute("title");
      var name = change.innerHTML;
      var string;

      //change font sizing if text will be visually truncated
      var nameSize = 14; //max name font-size (14=default)
      var addressSize = 13; //max address font-size
      var length = name.length + address.length;
      var increment = 9; //chars per font-size decrement
      var num = 35; //default max chars for no visual truncation
      var min = 13; //min readable font size
      while (true){
        if (length > num){
          if (nameSize <= min){
            break;
          }
          nameSize--;
          addressSize--;
          num += increment;
          //console.log("!CHANGED: " + name + " " + address + ":   " + (name.length + address.length));
        }
        else {
          //console.log(name + " " + address + ":   " + (name.length + address.length));
          break;
        }
      }

      change.setAttribute("style", "font-size:" + nameSize + "px"); //"name" is ?px bigger than address


      //error catching if email is from outlook-email-forwarding-fail (address is empty)
      if (address == ""){
        string = name +
        " <span style=\"color:gray; font-size: " + addressSize + "px\">" + "&lt;" + "none" + "&gt;" + "</span>"; //address is 1px smaller than name
      }
      else {
        string = name +
        " <span style=\"color:gray; font-size: " + addressSize + "px\">" + "&lt;" + address + "&gt;" + "</span>"; //address is 1px smaller than name
      }


      change.innerHTML = string;
    }
    else {
      continue;
    }
  }

  return filteredDivs;
}