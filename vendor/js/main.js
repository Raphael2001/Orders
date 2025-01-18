const INACTIVE_USER_TIME_THRESHOLD = 6000000; // 60 min - a.k.a 1 hour
const USER_ACTIVITY_THROTTLER_TIME = 60000;
// const BASE = "https://api-shipping360.aboohi.net/api/v1";
const BASE = "http://127.0.0.1:8080/api/v1";
const loginpageulr = "login.html";
const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
const just_to_target_list = ["Cheeta", "HFD"];

let tablerecordsnumtoshow = 10;

var date = new Date(),
  y = date.getFullYear(),
  m = date.getMonth();
var firstDay = new Date(y, m, 2).toISOString();
var lastDay = new Date(y, m + 1, 1).toISOString();
var date_today = new Date(),
  y = date_today.getUTCFullYear(),
  m = date_today.getUTCMonth(),
  d = date_today.getUTCDate() + 1;
var today = new Date(y, m, d).toISOString();
lastDay = getDatefromDatetimestring(lastDay);
firstDay = getDatefromDatetimestring(firstDay);
today = getDatefromDatetimestring(today);

let userActivityTimeout = null;
let userActivityThrottlerTimeout = null;

(function ($) {
  "use strict"; // Start of use strict

  $(document).ready(function () {
    $(function () {
      loaderrorpopup();
    });
  });
})(jQuery);

function resetUserActivityTimeout() {
  clearTimeout(userActivityTimeout);
  userActivityTimeout = setTimeout(() => {
    inactiveUserAction();
  }, INACTIVE_USER_TIME_THRESHOLD);
}

function activateActivityTracker() {
  window.addEventListener("mousemove", userActivityThrottler);
  window.addEventListener("scroll", userActivityThrottler);
  window.addEventListener("keydown", userActivityThrottler);
  window.addEventListener("resize", userActivityThrottler);
}

function userActivityThrottler() {
  if (!userActivityThrottlerTimeout) {
    userActivityThrottlerTimeout = setTimeout(() => {
      resetUserActivityTimeout();

      clearTimeout(userActivityThrottlerTimeout);
      userActivityThrottlerTimeout = null;
    }, USER_ACTIVITY_THROTTLER_TIME);
  }
}

function signout() {
  window.open(loginpageulr, "_self");
  localStorage.clear();
}

function closepopup(modal_id) {
  // closing the pop up by id
  document.getElementById(modal_id).style.display = "none";
  document.body.style = "overflow: scroll;";
}

function showpopup(modal_id) {
  // showign a pop up by id
  document.getElementById(modal_id).style.display = "block";
}

function getfirstletterofanyword(string) {
  var arr = string.split(" ");
  initials = "";
  for (key in arr) {
    word = arr[key];
    firstletter = word.charAt(0);
    initials += firstletter;
  }
  return initials.toUpperCase();
}

function showspinner() {
  // showing a spinner
  // window.scrollTo(0, 0);
  document.body.style = "overflow: hidden;margin: 0;";

  const lockModal = $("#lock-modal");
  const loadingCircle = $("#loading-circle");
  lockModal.css("display", "block");
  loadingCircle.css("display", "block");
}

function hidespinner() {
  // hidding a spinner
  document.body.style = "overflow: scroll";

  const lockModal = $("#lock-modal");
  const loadingCircle = $("#loading-circle");
  lockModal.css("display", "none");
  loadingCircle.css("display", "none");
}

function scrollToTop() {
  // Scroll to top logic
  var rootElement = document.documentElement;

  rootElement.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function clickbtntoggled() {
  // toggles the side bar

  $("#sidebar").toggleClass("toggled");
}

$(document).ready(function () {
  // when the page is ready the spinner is gone
  $(document).scroll(function () {});
});

document.onreadystatechange = () => {
  if (document.readyState === "interactive") {
    $("#loader-wrapper").css("background-color", "transparent");
  }
};

$(window).on("load", function () {
  // start the spinner on page load
  $("body").addClass("loaded");
  $(".loader-wrapper").fadeOut("slow");
});

function getlinkidfrombody() {
  body = document.getElementsByTagName("body");
  if (body != undefined) {
    id = body[0].id;
    localStorage.setItem("nav-link-id", id + "-link");
  }
}

function ErrorHandling(result) {
  if (result.status >= 400) {
    message = result.body.message;
    if (message.constructor == Object) {
      message = Object.values(message)[0];
    }
    document.getElementById("error-log").innerHTML = message;
    console.log(message);
    showpopup("modalerror");
    return false;
  }
  return true;
}

function putOrderDeatails(data) {
  // put the data of specific shipment in the model
  console.log(data);
  const DROPOFFPOINT = data["DropOffPoint"];
  const SHIPMENTINFO = data["ShipmentInfo"];
  const PICKUPPOINT = data["PickUpPoint"];

  document.getElementById("pickuppointname").innerHTML = PICKUPPOINT.FullName;
  document.getElementById("pickuppointphone").innerHTML = PICKUPPOINT.Phone;
  document.getElementById("pickuppointaddress").innerHTML =
    PICKUPPOINT.Address + ", " + PICKUPPOINT.City;
  document.getElementById("pickuppointmail").innerHTML = PICKUPPOINT.Mail;
  document.getElementById("pickuppointcomment").innerHTML = PICKUPPOINT.Comment;

  document.getElementById("dropoffpointname").innerHTML = DROPOFFPOINT.FullName;
  document.getElementById("dropoffpointphone").innerHTML = DROPOFFPOINT.Phone;
  document.getElementById("dropoffpointaddress").innerHTML =
    DROPOFFPOINT.Address + ", " + DROPOFFPOINT.City;
  document.getElementById("dropoffpointmail").innerHTML = DROPOFFPOINT.Mail;
  document.getElementById("dropoffpointcomment").innerHTML =
    DROPOFFPOINT.Comment;

  document.getElementById("order-title").innerHTML =
    "משלוח " + SHIPMENTINFO.OrderNo;
  document.getElementById("orderid").innerHTML = SHIPMENTINFO.OrderNo;
  document.getElementById("orderistributor").innerHTML =
    SHIPMENTINFO.Distributor.DisplayName;
  document.getElementById("ordercreate").innerHTML = SHIPMENTINFO.CreateDate;
  document.getElementById("orderdelivery").innerHTML =
    SHIPMENTINFO.DeliveryDate;
  document.getElementById("orderpickup").innerHTML = SHIPMENTINFO.PickUpDate;
  document.getElementById("orderstatus").innerHTML = SHIPMENTINFO.Status;
  document.getElementById("ordercreator").innerHTML = data.Creator.Fullname;
  document.getElementById("orderexternalid").innerHTML =
    SHIPMENTINFO.Externalid;
  document.getElementById("orderexternalstatus").innerHTML =
    SHIPMENTINFO.ExternalStatus;
  document.getElementById("ordertype").innerHTML = SHIPMENTINFO.Type;
}

function showemptyimg() {
  document.getElementById("image-empty").style.display = "block";
  document.getElementById("btn_showmore").style.display = "none";
  document.getElementById("orders").style.display = "none";
}

function hideemptyimg() {
  document.getElementById("image-empty").style.display = "none";
  document.getElementById("btn_showmore").style.display = "block";
  document.getElementById("orders").style.display = "block";
}

function sortTable(n) {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
      no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
            first, which contains table headers):*/
    for (i = 1; i < rows.length - 1; i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
                  one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
                  based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
                  and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /*If no switching has been done AND the direction is "asc",
                  set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function checkAll() {
  // checks all checkboxs in a page
  var inputs = document.querySelectorAll(".check-single");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].checked = true;
  }
}

function clearselction() {
  // clear the selected checkbox
  var checkboxes = document.querySelectorAll("input[type=checkbox]:checked");
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
}

function getCheckedBoxs() {
  // get all the selected checkbox
  var array = [];
  var checkboxes = document.querySelectorAll("input[type=checkbox]:checked");
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].id != "check-all") {
      array.push(checkboxes[i].value);
    }
  }
  return array;
}

function getDatefromDatetimestring(datestring) {
  arry = datestring.split("T");
  date = arry[0];
  return date;
}

function validateUsername(str) {
  var error = "";
  var illegalChars = /\W/; // allow letters, numbers, and underscores

  if (str == "") {
    error = "אנא הכנס שם משתמש";
  } else if (str.length < 5 || str.length > 15) {
    error = "שם משתמש תקין חייב להיות בין 5 - 15 אותיות";
  } else if (illegalChars.test(str)) {
    error = "אנא הכנס שם משתמש תקין. השתמש באותיות ומספרים בלבד";
  } else {
    error = "";
  }
  return error;
}

/* text rotate*/
var TxtRotate = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};
/* end*/

function loaderrorpopup() {
  src = document.getElementsByTagName("body")[0];
  error = `
            <div id="modalerror" class="modalerror modal-small-wrapper">
                    <div class="modal-small " style="width:35%;">
                        <span class="close" onclick="closepopup('modalerror')">&times;</span>
                        <br>
                        <p class="error" id ="error">
                            <i class='bx bx-error'></i>
                            <span id="error-log"></span>
                        </p>
                        <button class="btn-primary btn-ok" onclick="closepopup('modalerror')" style = "padding:5px; margin-top:10px;">אישור</button>
                    </div>
            </div>`;
  src.insertAdjacentHTML("afterbegin", error);
}

function showerror(error) {
  document.getElementById("error-log").innerHTML = error;
  showpopup("modalerror");
}

function passwordvalidation(password) {
  var letter = document.getElementById("letter");
  var capital = document.getElementById("capital");
  var number = document.getElementById("number");
  var length = document.getElementById("length");

  // When the user clicks on the password field, show the message box
  password.onfocus = function () {
    document.getElementById("message").style.display = "block";
  };

  // When the user clicks outside of the password field, hide the message box
  password.onblur = function () {
    document.getElementById("message").style.display = "none";
  };

  // When the user starts to type something inside the password field
  password.onkeyup = function () {
    // Validate lowercase letters
    var lowerCaseLetters = /[a-z]/g;
    if (password.value.match(lowerCaseLetters)) {
      letter.classList.remove("invalid");
      letter.classList.add("valid");
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
    }

    // Validate numbers
    var numbers = /[0-9]/g;
    if (password.value.match(numbers)) {
      number.classList.remove("invalid");
      number.classList.add("valid");
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
    }

    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if (password.value.match(upperCaseLetters)) {
      capital.classList.remove("invalid");
      capital.classList.add("valid");
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
    }

    // Validate length
    if (password.value.length >= 8) {
      length.classList.remove("invalid");
      length.classList.add("valid");
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
    }
  };
}

function checkPassword(password) {
  if (password != "") {
    if (password.length < 8) {
      document.getElementById("error-log").innerHTML =
        "סיסמא חייבת להכיל לפחות 8 תווים";
      return false;
    }
    re = /[0-9]/;
    if (!re.test(password)) {
      document.getElementById("error-log").innerHTML =
        "סיסמא חייבת להכיל לפחות ספרה אחת";
      return false;
    }
    re = /[a-z]/;
    if (!re.test(password)) {
      document.getElementById("error-log").innerHTML =
        "סיסמא חייבת להכיל לפחות אות אחת קטנה";
      return false;
    }
    re = /[A-Z]/;
    if (!re.test(password)) {
      document.getElementById("error-log").innerHTML =
        "סיסמא חייבת להכיל לפחות אות אחת גדולה";
      return false;
    }
  } else {
    document.getElementById("error-log").innerHTML = "אנא בדקו שהכנסתם סיסמא";
    return false;
  }

  return true;
}

function getKeyWordFromQuery(keyword) {
  // get the keyword form the query url
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const res = urlParams.get(keyword);
  if (res != null) {
    var arr = res.split(",");
    return arr[0];
  }
  return "";
}

function clearformbyclassname(className) {
  var inputs = document.getElementsByClassName(className);

  for (var i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
  var select = document.getElementsByTagName("select");
  for (var i = 0; i < select.length; i++) {
    select[i].value = "";
  }
  checkbox = document.getElementById("check-" + className);
  if (checkbox != undefined) {
    checkbox.checked = false;
  }
}

function getshippingbyorderno(orderno) {
  const URL = BASE + "/getshippingbyorderno?orderno=" + orderno;

  const otherPram = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    method: "GET",
  };

  fetch(URL, otherPram)
    .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
    .then((res) => {
      if (ErrorHandling(res)) {
        order = res["body"]["body"];
        return order;
      }
    })

    .catch(function (error) {
      showerror(error);
    });
}

class Chart {
  constructor(chartid, height, filter_dict, element_id) {
    this.chartId = chartid;
    this.height = height;
    this.filter_dict = filter_dict;
    this.element_id = element_id;
  }
  createChart(sdk) {
    return sdk.createChart({
      chartId: this.chartId,
      height: this.height,
      showAttribution: false,
      filter: this.filter_dict,
      background: "#fdfdff",
    });
  }

  render(sdk) {
    const chart = this.createChart(sdk);
    chart.render(document.getElementById(this.element_id));
  }
}
