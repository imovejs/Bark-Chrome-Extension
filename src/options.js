var data = {
  serverURLs: []
}
var data = {}
var dataServerURLs = []


/**
 * default push content
 */
var radios = document.getElementsByName("default_push_content");
for(i in radios) {
  radios[i].onclick = function(it) {
    data.defaultPushContent = this.value;
  }
}

Object.defineProperty(data, 'defaultPushContent', {
  configurable: true,
  get: function() {
    return defaultPushContent;
  },
  set: function(value) {
    console.log(value);
    defaultPushContent = value;
    document.getElementById(value).checked=true;

    //save to chrome.storage
    chrome.storage.sync.set({
      default_push_content: this.defaultPushContent,
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 200);
    });
    // Update status to let user know options were saved.
    chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
      console.log(response.farewell);
    });
  }
})

/**
 * autocopy
 */

 var radios = document.getElementsByName("auto_copy");
 for(i in radios) {
   radios[i].onclick = function(it) {
     data.autoCopy = this.value;
   }
 }

 Object.defineProperty(data, 'autoCopy', {
   configurable: true,
   get: function() {
     return autoCopy;
   },
   set: function(value) {
     console.log(value);
     autoCopy = value;
     document.getElementById(value).checked=true;

     //save to chrome.storage
     chrome.storage.sync.set({
       auto_copy: this.autoCopy,
     }, function() {
       // Update status to let user know options were saved.
       var status = document.getElementById('status');
       status.textContent = 'Options saved.';
       setTimeout(function() {
         status.textContent = '';
       }, 200);
     });

     // Update status to let user know options were saved.
     chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
       console.log(response.farewell);
     });
   }
 })


/**
 * set serverURLs
 */
Object.defineProperty(data, 'serverURLs', {
    configurable: true,
    get: function() {
      return dataServerURLs;
    },
    set: function(value) {
      dataServerURLs = value;
      var str = '<ul>';
      value.forEach(function(it) {
        str += `<li class="url">
          <div class="urlbox">
            <div class="name">${it.server_name}</div>
            <div class="btn-delete">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/>
              </svg>
            </div>
          </div>
          <div class="textEllipsis">
              ${it.server_url}
            </div>
        </li>`;
      }); 

      str += '</ul>';
      document.getElementById('urls').innerHTML = str;
      //set delete button 
      $("ul").on("click", ".btn-delete", delete_server);

      //save to chrome.storage
      chrome.storage.sync.set({
        server_urls: this.serverURLs,
      }, function() {
        // Update status to let user know options were saved.
        chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
          console.log(response.farewell);
        });

        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
          status.textContent = '';
        }, 750);
      });

    }
})

/**
 * select device type
 */
var radios = document.getElementsByName("device");
for(i in radios) {
  radios[i].onclick = function(it) {
    if (this.value === "Android") {
      document.getElementById("server_url").placeholder = "Android FCM Token"
    }
    if (this.value === "iPhone") {
      document.getElementById("server_url").placeholder = "Bark-revision Push URL: https://day.app/xxxkeyxxxx/"
    }
  }
}

function ValidURL(str) {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!regex .test(str)) {
    alert("Please enter valid URL.");
    return false;
  } else {
    return true;
  }
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    server_urls: [],
    default_push_content: "clipboard",
    auto_copy: "no"
  }, function(items) {
    data.serverURLs = items.server_urls;
    data.defaultPushContent = items.default_push_content;
    data.autoCopy = items.auto_copy;
    // document.getElementById('server_url').value = items.server_urls;
  });
}

//delete server urls
function delete_server(e) {
  e.preventDefault();
  dataServerURLs.splice($(this).parent().index(), 1);
  data.serverURLs = dataServerURLs;
  $(this).parent().remove();
}

// Saves options to chrome.storage
function addServer() {
  var server_name = document.getElementById('server_name').value;
  var server_url = document.getElementById('server_url').value;

  if (document.getElementsByName("device")[1].checked == true) {
    console.log('Valid Android Token');
    data.serverURLs.push({"server_name": server_name, "server_url": server_url});
    data.serverURLs = data.serverURLs
    return
  }

  if (ValidURL(server_url)) { //check url if valid 

    console.log('Valid Server');
    data.serverURLs.push({"server_name": server_name, "server_url": server_url});
    data.serverURLs = data.serverURLs
  }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('add').addEventListener('click',
    addServer);

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4) {
          if (xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
          } else {
            callback('error');
          }
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

