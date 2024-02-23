const CREATOR_ROLE = "owner";
let side;
const admin_array = ["admin", CREATOR_ROLE];

(function ($) {
  "use strict"; // Start of use strict
  activateActivityTracker();

  $(document).ready(function () {
    side = document.getElementById("sidebar");
    if (side != undefined) {
      $(function () {
        getlinkidfrombody();
        loadsidebar();
        // $("#sidebar").load("sidebar.html");
      });

      $(function () {
        loadnavbar();
      });

      $(function () {
        $(".navbar-toggler").click(function (e) {
          e.preventDefault();
        });
      });

      $(function () {
        addbanner();
        checkforfreetrial();
      });
    }
  });
})(jQuery);

function loadnavbar() {
  // $("#navbar").load("navbar.html");
  // callback();

  src = document.getElementById("navbar");
  fullname = getusernamefromlocalStorage();
  initials = getfirstletterofanyword(fullname);
  navbar = `
  <div class="container-fluid">

 
  <button class="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index"
      aria-expanded="false" aria-label="Toggle navigation">
      <span class="sr-only">Toggle navigation</span>
      <span class="navbar-toggler-icon icon-bar"></span>
      <span class="navbar-toggler-icon icon-bar"></span>
      <span class="navbar-toggler-icon icon-bar"></span>
  </button>

  <div class="user-navigation" id = "user-navigation" >
    <div class = "initials">
      <h6>${initials}</h6>
    <div>
 
    <div class="dropdown-content" id = "dropdown-content">
        <a>${fullname}</a>
        <a id = "mydetails-link" href="mydetails.html">
          <span class='bx bxs-user-detail'></span>הפרטים שלי
        </a>
        <a herf="#" onclick="signout()">
            <p><span class='bx bx-log-out'></span>יציאה</p>
        </a>

    </div>
  </div>
</div>
  
</div>`;

  src.insertAdjacentHTML("afterbegin", navbar);
}

function loadsidebar() {
  src = document.getElementById("sidebar");
  if (sidebar != undefined) {
    active = localStorage.getItem("nav-link-id");
    sidebar = `
  <div class="logo">
      <a class="simple-text logo-normal">
  
          משלוחים 360
          <span>alpha</span>
      </a>
  
  </div>
  <div class="sidebar-wrapper">
      <ul class="nav">
          <div class="nav-list">
              <li class="nav-item">
                  <a class="nav-link" id="dashboard-link" href="dashboard.html">
                      <p> <span class='bx bxs-dashboard'></span> לוח בקרה </p>
  
                  </a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" id="createdelivery-link" href="createdelivery.html">
                      <p> <span class='bx bx-trip'></span> צור משלוח </p>
  
  
                  </a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" id="orderssummary-link" href="orderssummary.html">
  
                      <p> <span class='bx bx-history'></span>סיכום המשלוחים</p>
                  </a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" id="favorites-link" href="favorites.html">
  
                      <p> <span class='bx bxs-star'></span>המועדפים שלי</p>
                  </a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" id="myconnections-link" href="myconnections.html">
  
                      <p> <span class='bx bx-stats'></span>החיבורים שלי</p>
                  </a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" id="myusers-link" href="myusers.html">
                      <p> <span class='bx bx-user'></span>המשתמשים שלי</p>
                  </a>
              </li>
              <li class="nav-item">
              <a class="nav-link" id="mydistributor-link" href="mydistributors.html">
                  <p> <span class='bx bxs-ship'></span>המפיצים שלי</p>
              </a>
          </li>
        
          </div>
          
          <li class="nav-item gototop">
            <a class="nav-link" id="gototop-link" href="#top">
              <p> <span class='bx bxs-up-arrow-circle'></span> קפוץ למעלה</p>
            </a>
        </li>
         
  
      </ul>
  
     
  </div>
  <script>
      $("a[href='#top']").click(function () {
          $("html, body").animate({ scrollTop: 0 }, "fast");
          return false;
      });
  </script>`;
    src.insertAdjacentHTML("afterbegin", sidebar);
    $("li").removeClass("active");
    nav_item = document.getElementById(active);
    console.log(nav_item);
    nav_item.parentElement.classList.add("active");
  }
}

function inactiveUserAction() {
  // logout logic
  analytics.logEvent("user is automatically loged out", {
    email: localStorage.getItem("Mail"),
  });
  analytics.setUserProperties({ UID: localStorage.getItem("Token") });

  signout();
}

function getusernamefromlocalStorage() {
  // get the username from the local storage
  Company = getcurrentCompany();
  users = Company.UNE;
  console.log(users);
  for (var key in users) {
    // check if the property/key is defined in the object itself, not in parent
    if (users.hasOwnProperty(key)) {
      if (key == localStorage.getItem("Token")) {
        user = users[key];
        return user["Fullname"];
      }
    }
  }
}

function getCompanyID() {
  //get the current company id from local storage
  Company = getcurrentCompany();
  return Number(Company.CompanyID);
}

function createDelivery() {
  // creates new delivery

  let URL = BASE + "/shipping";

  const distributor = document.getElementById("distributor").value;
  const type = document.getElementById("type").value;
  const token = localStorage.getItem("Token");
  const companyid = getCompanyID();
  state = localStorage.getItem("stateid");
  const direction = document.getElementById(state).value;
  const source = "Website";
  const govina = document.getElementById("moneycollect").value;
  var Data = {};
  if (distributor != "" || type != "") {
    if (type == "גוביינא" && govina == "") {
      alert("סכום הגוביינא צריך להכיל מידע");
    } else {
      receiverdata = getDataFromInputs("receiver");
      senderdata = getDataFromInputs("sender");
      receiver_checkbox = document.getElementById("check-receiver");
      sender_checkbox = document.getElementById("check-sender");
      Data = {
        senderinfo: senderdata,
        receiverinfo: receiverdata,
        type: type,
        distributor: distributor,
        companyid: companyid,
        token: token,
        direction: direction,
        source: source,
        govina: govina,
      };
      const otherPram = {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(Data),
        method: "POST",
      };
      console.log(URL);
      fetch(URL, otherPram)
        .then((r) => {
          return r.json().then((data) => ({ status: r.status, body: data }));
        })
        .then((res) => {
          console.log();
          res;
          if (ErrorHandling(res)) {
            return res;
          } else {
            return null;
          }
        })
        .then((result) => {
          if (result != null) {
            if (sender_checkbox.checked == true) {
              hidespinner();
              showspinner();
              addfavorite(senderdata);
            }

            return result;
          }
        })
        .then((result) => {
          if (result != null) {
            if (receiver_checkbox.checked == true) {
              hidespinner();
              showspinner();
              addfavorite(receiverdata);
            }
            return result;
          }
        })
        .then((result) => {
          if (result != null) {
            showspinner();
            modal.style.display = "block";
            orderNo = result["body"]["body"];
            document.getElementById("model-ordernum").innerHTML =
              "<strong> מספר משלוח: </strong>" + orderNo;
          }
          hidespinner();
          clearformbyclassname("sender");
          clearformbyclassname("receiver");
          document.getElementById("moneycollect").value = "";
          putCompanyDeatials_trigger("sender");
          // location.reload();
          analytics.logEvent("New Delivery Created", { OrderNumber: orderNo });
          analytics.setUserProperties({ UID: localStorage.getItem("Token") });
        })
        .catch(function (error) {
          console.log(error);
          showerror(error);
          hidespinner();
          clearformbyclassname("sender");
          clearformbyclassname("receiver");
          document.getElementById("moneycollect").value = "";
          putCompanyDeatials_trigger("sender");
        });
    }
  }
}

function updateDelivery() {
  // updates a delivery
  showspinner();
  let URL = BASE + "/shipping";

  const distributor = document.getElementById("distributor").value;
  const type = document.getElementById("type").value;
  const token = localStorage.getItem("Token");
  const companyid = getCompanyID();
  state = localStorage.getItem("stateid");
  const direction = document.getElementById(state).value;
  const govina = document.getElementById("moneycollect").value;
  const externalid = document.getElementById("externalid").value;
  const route = document.getElementById("route").value;
  const order_no = localStorage.getItem("OrderNo");

  if (distributor != "" || type != "") {
    if (type == "גוביינא" && govina == "") {
      alert("סכום הגוביינא צריך להכיל מידע");
    } else {
      receiverdata = getDataFromInputs("receiver");
      senderdata = getDataFromInputs("sender");
      receiver_checkbox = document.getElementById("check-receiver");
      sender_checkbox = document.getElementById("check-sender");
      const Data = {
        orderno: order_no,
        senderinfo: senderdata,
        receiverinfo: receiverdata,
        type: type,
        distributor: distributor,
        companyid: companyid,
        token: token,
        direction: direction,
        govina: govina,
        externalid: externalid,
        route: route,
      };
      const otherPram = {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(Data),
        method: "PUT",
      };
      console.log(URL);

      console.log(JSON.stringify(Data));
      fetch(URL, otherPram)
        .then((r) =>
          r.json().then((data) => ({ status: r.status, body: data }))
        )
        .then((res) => {
          if (ErrorHandling(res)) {
            return res;
          } else {
            return null;
          }
        })
        .then((result) => {
          if (result != null) {
            if (sender_checkbox.checked == true) {
              hidespinner();
              showspinner();
              addfavorite(senderdata);
            }

            return result;
          }
        })
        .then((result) => {
          if (result != null) {
            console.log(receiver_checkbox.checked);

            if (receiver_checkbox.checked == true) {
              hidespinner();
              showspinner();
              addfavorite(receiverdata);
            }
            return result;
          }
        })
        .then((result) => {
          if (result != null) {
            window.open("orderssummary.html", "_self");
          }
          hidespinner();
        })
        .catch(function (error) {
          showerror(error);
          hidespinner();
        });
    }
  }
}

function clearformdelivery() {
  // clears the form create delivery
  document.getElementById("receivername").value = "";
  document.getElementById("receivercity").value = "";
  document.getElementById("receiveraddress").value = "";
  document.getElementById("receiveremail").value = "";
  document.getElementById("receiverphone").value = "";
  document.getElementById("receiverphone2").value = "";
  document.getElementById("distributor").value = "";
  document.getElementById("receivercomment").value = "";
}

function loaddata() {
  // load data and put it in a table
  showspinner();
  hideemptyimg();
  lastid = localStorage.getItem("lastid");
  compnayId = getCompanyID();
  uid = localStorage.getItem("Token");
  const URL =
    BASE +
    "/shipping?lastid=" +
    lastid +
    "&recordsnumtoshow=" +
    tablerecordsnumtoshow +
    "&companyid=" +
    compnayId +
    "&token=" +
    uid;

  const otherPram = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    method: "GET",
  };

  console.log(URL);

  fetch(URL, otherPram)
    .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
    .then((res) => {
      if (ErrorHandling(res)) {
        last_id = res["body"]["message"];
        if (last_id == -1) {
          document.getElementById("btn_showmore").style = "visibility: hidden;";
        }
        localStorage.setItem("lastid", last_id);
        data = res["body"]["body"];
        if (Object.keys(res).length === 0 && res.constructor === Object) {
          // checking if empty
          showemptyimg();
        }

        for (var key in data) {
          // check if the property/key is defined in the object itself, not in parent
          if (data.hasOwnProperty(key)) {
            localStorage.setItem(key, JSON.stringify(data[key]));
            createtable(data[key]);
          }
        }
      }
      hidespinner();
    })
    .catch(function (error) {
      showerror(error);
      hidespinner();
    });
}

function loaddatabydateordernoanddistributors(
  datefrom,
  dateto,
  orderno,
  distributors
) {
  showspinner();
  hideemptyimg();
  document.getElementById("tbody").innerHTML = "";
  var btn = document.getElementById("btn_showmore");
  btn.css = "visibility: visible;";
  btn.innerHTML = "אפס";
  $("#btn_showmore").on("click", function () {
    // document.getElementById("tbody").innerHTML = "";
    // localStorage.setItem("lastid", 0);
    // btn.innerHTML = "הצג עוד";
    location.reload();
  });

  compnayId = getCompanyID();
  uid = localStorage.getItem("Token");
  lastid = localStorage.getItem("lastid");
  console.log(distributors);
  const URL =
    BASE +
    "/getshippingbydatesordernoanddistributors?from=" +
    datefrom +
    "&to=" +
    dateto +
    "&orderno=" +
    orderno +
    "&distributors=" +
    "[" +
    distributors +
    "]" +
    "&companyid=" +
    compnayId +
    "&token=" +
    uid;

  const otherPram = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    method: "GET",
  };
  console.log(URL);
  fetch(URL, otherPram)
    .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
    .then((res) => {
      if (ErrorHandling(res)) {
        res = res["body"]["body"];

        if (Object.keys(res).length === 0 && res.constructor === Object) {
          // checking if empty
          showemptyimg();
        }
        for (var key in res) {
          // check if the property/key is defined in the object itself, not in parent
          if (res.hasOwnProperty(key)) {
            shipment = res[key];
            localStorage.setItem(key, JSON.stringify(shipment));
            createtable(shipment);
          }
        }
      }
      hidespinner();
    })
    .catch(function (error) {
      showerror(error);
      hidespinner();
    });
}

function createtable(data) {
  var src = document.getElementById("tbody");
  const DROPOFFPOINT = data["DropOffPoint"];
  const SHIPMENTINFO = data["ShipmentInfo"];
  const printed = data.Printed;
  orderNo = SHIPMENTINFO.OrderNo;
  row = ` <tr class = "trbody" value = "${orderNo}" id = "${orderNo}">
          <td data-th="תאריך הזמנה">${SHIPMENTINFO.CreateDate}</td>
          <td class = "OrderNo" data-th="מספר הזמנה">${orderNo}</td>
          <td data-th="שם לקוח">${DROPOFFPOINT.FullName}</td>
          <td data-th="כתובת">${
            DROPOFFPOINT.Address + ", " + DROPOFFPOINT.City
          }</td>
          <td data-th="טלפון">${DROPOFFPOINT.Phone}</td>
          <td data-th="סטטוס">${SHIPMENTINFO.Status}</td>
          <td data-th="מפיץ">${SHIPMENTINFO.Distributor.DisplayName}</td>
          <td data-th="הודפס">
            ${
              printed
                ? `<span class="bx bx-check" />`
                : `<span class="bx bx-x" />`
            }
          </td>
          <td data-th= "בחר">
              <input class="check-single" type="checkbox" id="check-${orderNo}" value="${orderNo}">
          </td>
        </tr>`;
  src.insertAdjacentHTML("beforeend", row);
  tr = document.getElementById(orderNo);
  tr.ondblclick = moreDetails;
}

function createStickers(data) {
  // creates a sticker
  // source
  var src = document.getElementById("printcontainer");
  const DROPOFFPOINT = data["DropOffPoint"];
  const SHIPMENTINFO = data["ShipmentInfo"];
  const PICKUPPOINT = data["PickUpPoint"];

  html = ` <div class="sticker-content col-12">
      <div class="text-center">
          <div id="barcode-${SHIPMENTINFO.OrderNo}" class="barcode"
              style="padding: 0px; overflow: auto; width: 264px;">
          </div>
          <div style="font-size:12px"> ${
            SHIPMENTINFO.PublicId ? SHIPMENTINFO.PublicId : ""
          } </div>
      </div>

      <div class="text-right">
          <p class="d-flex justify-content-between">
          <div class="col" id = "header-${SHIPMENTINFO.OrderNo}">
              <span class="distributor_text"><strong>נשלח באמצעות: </strong>${
                SHIPMENTINFO.Distributor.DisplayName
              }</span>
              <br>
              <span><strong>מאת: </strong>${PICKUPPOINT.FullName}</span>
              <br>
              <span><strong>טל׳: </strong>${PICKUPPOINT.Phone}</span>
             

          </div>
          </p>
          <div class="p-1 d-flex reciverinfo">
              <div class="pr-1">
                  <p><strong>שם המקבל: </strong>${DROPOFFPOINT.FullName}</p>
                  <p id = "reciverphone-${
                    SHIPMENTINFO.OrderNo
                  }"><strong>טל׳: </strong> ${DROPOFFPOINT.Phone}</p>
                  <p><strong>כתובת: </strong>${
                    DROPOFFPOINT.Address + ", " + DROPOFFPOINT.City
                  }</p>
                  <p><strong>סוג: </strong>${SHIPMENTINFO.Type}</p>
              </div>
          </div>
          <div class="d-flex justify-content-between">
              <p class="footer"><strong>הערות: </strong>${
                DROPOFFPOINT.Comment
              }</p>
              <div class="text-left"><img
                      src="https://firebasestorage.googleapis.com/v0/b/orders-1f4fb.appspot.com/o/%D7%A1%D7%9E%D7%9C%20%D7%A8%D7%A4%D7%95%D7%90%D7%94%20%D7%95%D7%98%D7%91%D7%A2.png?alt=media&amp;token=6c23c93f-31b7-41b4-a734-ead364d45d91"
                      width="45" height="45"></div>
          </div>
      </div>
    </div>`;
  src.insertAdjacentHTML("afterbegin", html);

  phone_src = document.getElementById(`reciverphone-${SHIPMENTINFO.OrderNo}`);
  if (DROPOFFPOINT.Phone2 != "") {
    html = ` <strong>טל׳: </strong>
      ${DROPOFFPOINT.Phone2} / ${DROPOFFPOINT.Phone}`;
    phone_src.innerHTML = html;
  }

  if ("Route" in SHIPMENTINFO) {
    route_src = document.getElementById(`header-${SHIPMENTINFO.OrderNo}`);
    html = `<br>
      <span><strong>מסלול: </strong>${SHIPMENTINFO.Route}</span>`;
    route_src.insertAdjacentHTML("beforeend", html);
  }
  if ("Branch" in SHIPMENTINFO) {
    branch_src = document.getElementById(`header-${SHIPMENTINFO.OrderNo}`);
    html = `<span>       <strong>סניף: </strong>${SHIPMENTINFO.Branch}</span>`;
    branch_src.insertAdjacentHTML("beforeend", html);
  }
  if (SHIPMENTINFO.Distributor.DBName === "MahierLi") {
    generateBarcode(
      SHIPMENTINFO.ExternalBarcode,
      "#barcode-" + SHIPMENTINFO.OrderNo
    );
  } else if (SHIPMENTINFO.Distributor.DBName === "Tapuz") {
    generateBarcode(
      SHIPMENTINFO.Externalid,
      "#barcode-" + SHIPMENTINFO.OrderNo
    );
  } else {
    generateBarcode(SHIPMENTINFO.OrderNo, "#barcode-" + SHIPMENTINFO.OrderNo);
  }

  // if (SHIPMENTINFO.Externalid == "")
  //   generateBarcode(SHIPMENTINFO.OrderNo, "#barcode-" + SHIPMENTINFO.OrderNo);
  // else {
  //   generateBarcode(
  //     SHIPMENTINFO.Externalid,
  //     "#barcode-" + SHIPMENTINFO.OrderNo
  //   );
  //}
}

function createA4(data) {
  var src = document.getElementById("printcontainer");
  const DROPOFFPOINT = data["DropOffPoint"];
  const SHIPMENTINFO = data["ShipmentInfo"];
  const PICKUPPOINT = data["PickUpPoint"];

  html = `<div class="container a4-content">
              <div class="row justify-content-center">
                  <div class="col-xl-6 col-md-10 py-5 ">
                      <div class="row mb-3 w-100 mx-auto">
                      <div id="barcode-${SHIPMENTINFO.OrderNo}" class="barcode"
                            style="padding: 0px; overflow: auto; width: 264px;">
                        </div>
                          <div class="col-12">
                              <h2 class="floating-text" style = "width:115px;"><strong>השליחות יוצאת מ</strong></h2>
                              <table cellpadding="0" cellspacing="0" class="table borderless border-outer mt-0 bg-white"
                                  style="margin-top:10px;float:right;">
                                 
                                  <tbody>
                                      <tr>
                                          <td></td>
                                          <td></td>
                                      </tr>
                                      <tr>
                                          <td></td>
                                          <td></td>
                                      </tr>
                                      <tr class = "a4-text">
                                          <td class= "a4-features">כתובת מקור:</td>
                                          <td>${
                                            PICKUPPOINT.City +
                                            ",  " +
                                            PICKUPPOINT.Address
                                          }</td>
                                      </tr>
                                      <tr class = "a4-text">
                                          <td>שם המוסר:</td>
                                          <td>${PICKUPPOINT.FullName}</td>
                                      </tr>
                                      <tr class = "a4-text">
                                          <td>טלפון מוסר:</td>
                                          <td>${PICKUPPOINT.Phone}</td>
                                      </tr>
                                      <tr class = "a4-text">
                                          <td>הערות לכתובת:</td>
                                          <td>${PICKUPPOINT.Comment}</td>
                                      </tr>

                                  </tbody>
                              </table>
                          </div>
                          <div class="col-12 mt-2">
                              <h2 class="floating-text" style = "width:136px;"><strong>השליחות מתקבלת מ</strong></h2>
                              <table cellpadding="0" cellspacing="0" class="table borderless border-outer mt-0 bg-white"
                                  style="margin-top:10px;float:right;">
                                  <tbody>
                                      <tr>
                                          <td></td>
                                          <td></td>
                                      </tr>
                                      <tr>
                                          <td></td>
                                          <td></td>
                                      </tr>
                                      <tr class = "a4-text">
                                          <td class= "a4-features"">כתובת יעד:</td>
                                          <td>${
                                            DROPOFFPOINT.City +
                                            ",  " +
                                            DROPOFFPOINT.Address
                                          }</td>
                                      </tr>
                                      <tr class = "a4-text">
                                          <td>שם המקבל:</td>
                                          <td>${DROPOFFPOINT.FullName}</td>
                                      </tr>
                                      <tr class = "a4-text">
                                          <td >טלפון מקבל:</td>
                                          <td id ="reciverphone-${
                                            SHIPMENTINFO.OrderNo
                                          }">${DROPOFFPOINT.Phone}</td>
                                      </tr>
                                      <tr class = "a4-text">
                                          <td>הערות לכתובת:</td>
                                          <td>${DROPOFFPOINT.Comment}</td>
                                      </tr>

                                  </tbody>
                              </table>
                          </div>
                          <div class="col-12 mt-2">
                          <h2 class="floating-text"  style = "width:85px;"><strong>פרטי שליחות</strong></h2>
                          <table cellpadding="0" cellspacing="0" class="table borderless border-outer mt-0 bg-white"
                              style="margin-top:10px;float:right;">
                              <tbody id = "details-${SHIPMENTINFO.OrderNo}">
                                  <tr>
                                      <td></td>
                                      <td></td>
                                  </tr>
                                 

                                  <tr class = "a4-text">
                                    
                                      <td class= "a4-features">שליחות מספר:</td>
                                      <td>${SHIPMENTINFO.OrderNo}</td>
                                  </tr>
                                 
                                  <tr class = "a4-text">
                                    
                                  <td>סוג:</td>
                                  <td>${SHIPMENTINFO.Type}</td>
                              </tr>
                             


                              </tbody>
                          </table>
                      </div>

                      </div>
                  </div>


              </div>
          </div>`;
  src.insertAdjacentHTML("afterbegin", html);

  phone_src = document.getElementById(`reciverphone-${SHIPMENTINFO.OrderNo}`);
  if (DROPOFFPOINT.Phone2 != "") {
    html = `${DROPOFFPOINT.Phone2} / ${DROPOFFPOINT.Phone}`;
    phone_src.innerHTML = html;
  }

  if ("Route" in SHIPMENTINFO) {
    route_src = document.getElementById(`details-${SHIPMENTINFO.OrderNo}`);
    html = `<tr class = "a4-text">                       
              <td>מסלול:</td>
              <td>${SHIPMENTINFO.Route}</td>
            </tr>`;
    route_src.insertAdjacentHTML("beforeend", html);
  }
  if ("Branch" in SHIPMENTINFO) {
    branch_src = document.getElementById(`details-${SHIPMENTINFO.OrderNo}`);
    html = `<tr class = "a4-text">                       
              <td>סניף:</td>
              <td>${SHIPMENTINFO.Branch}</td>
            </tr>`;
    branch_src.insertAdjacentHTML("beforeend", html);
  }

  generateBarcode(SHIPMENTINFO.OrderNo, "#barcode-" + SHIPMENTINFO.OrderNo);
}

function createPagePrint(createpagefunction) {
  // creates the sticker page
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const orderNo = urlParams.get("dno");
  var arr = orderNo.split(",");
  console.log(arr.length);
  for (let i of arr) {
    let myData = localStorage.getItem(i);
    myData = JSON.parse(myData);
    createpagefunction(myData);
  }
}

function generateBarcode(valueBarcode, place) {
  // generate barcode on specefic loaction
  var value = valueBarcode;
  var btype = "code128";
  var renderer = "css";

  var settings = {
    output: renderer,
    barWidth: 2,
    barHeight: 40,
    moduleSize: 5,
    posX: 10,
    posY: 20,
    fontSize: 15,
  };

  $(place).html("").show().barcode(value, btype, settings);
}

function updateDetails() {
  // updates the data on all selected checkbox
  array = getCheckedBoxs();
  array.forEach(updatedata);
  closepopup("bg-modal");
  showspinner();
  clearselction();
}

function updatedata(index) {
  // update the data of specific shipment
  const URL = BASE + "/shipmentupdate";

  PickUpDate = document.getElementById("PickUpDate").value;
  DeliveryDate = document.getElementById("DeliveryDate").value;
  Status = document.getElementById("status").value;

  const Data = {
    orderno: index,
    pickupdate: PickUpDate,
    deliverydate: DeliveryDate,
    status: Status,
    token: localStorage.getItem("Token"),
    companyid: getCompanyID(),
  };

  const otherPram = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(Data),
    method: "PUT",
  };
  console.log(URL);
  fetch(URL, otherPram)
    .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
    .then((res) => {
      if (ErrorHandling(res)) {
        document.body.style = "overflow: scroll";
      }
      hidespinner();
      location.reload();
    })
    .catch(function (error) {
      showerror(error);
      hidespinner();
    });
}

function createCompany() {
  //creates new copmany
  const URL = BASE + "/company";

  const companyName = document.getElementById("companyname").value;
  const companyCity = document.getElementById("companycity").value;
  const companyStreet = document.getElementById("companystreet").value;
  const companyPhone = document.getElementById("companyphone").value;
  const companyComment = document.getElementById("companycomment").value;
  const userfullname = document.getElementById("userfullname").value;
  const Email = localStorage.getItem("Mail");
  const UID = localStorage.getItem("Token");

  const Data = {
    companyName: companyName,
    companyCity: companyCity,
    companyStreet: companyStreet,
    companyPhone: companyPhone,
    companyComment: companyComment,
    userfullname: userfullname,
    email: Email,
    token: UID,
  };

  const otherPram = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(Data),
    method: "POST",
  };
  console.log(URL);
  fetch(URL, otherPram)
    .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
    .then((res) => {
      if (ErrorHandling(res));
      {
        id = res["body"]["body"];
        console.log("New Company Created " + id);
        getCompanybyUsersEmail(
          localStorage.getItem("Mail"),
          localStorage.getItem("Token"),
          true
        );
        clearformbyclassname("company");
        analytics.logEvent("New Company Created", { companyid: id });
        analytics.setUserProperties({ UID: localStorage.getItem("Token") });
      }
      hidespinner();
    })
    .catch(function (error) {
      showerror(error);
      hidespinner();
    });
  // clearFormCompany();
}

function clearFormCompany() {
  // clears the create company form
  document.getElementById("companyname").value = "";
  document.getElementById("companycity").value = "";
  document.getElementById("companystreet").value = "";
  document.getElementById("companyphone").value = "";
  document.getElementById("companycomment").value = "";
}

function newuser() {
  // creates a new user
  const URL = BASE + "/createuser";

  const userEmail = document.getElementById("new-email").value;
  const user_elem_Password = document.getElementById("new-password");
  const userPassword = user_elem_Password.value;
  const userFullname = document.getElementById("new-fullname").value;

  if (checkPassword(userPassword)) {
    showspinner();
    const Data = {
      email: userEmail,
      password: userPassword,
    };

    const otherPram = {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(Data),
      method: "POST",
    };
    console.log(URL);
    fetch(URL, otherPram)
      .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
      .then((res) => {
        if (ErrorHandling(res)) {
          localStorage.setItem("email", userEmail);
          localStorage.setItem("uid", res["body"]["body"]);
          window.open("createcompany.html?fullname=" + userFullname, "_self");
          analytics.logEvent("new user is created", {
            email: localStorage.getItem("Mail"),
          });
          analytics.setUserProperties({ UID: localStorage.getItem("Token") });
        }
        hidespinner();
      })
      .catch(function (error) {
        showerror(error);
        alert("Email or Password are wrong");
      });
  } else {
    showpopup("modalerror");
    user_elem_Password.focus();
  }
}

function login() {
  // login a user to the system
  const URL = BASE + "/login";

  const userEmail = document.getElementById("userEmail").value;
  const userPassword = document.getElementById("userPassword").value;

  const Data = {
    email: userEmail,
    password: userPassword,
  };

  const otherPram = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(Data),
    method: "POST",
  };

  fetch(URL, otherPram)
    .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
    .then((res) => {
      if (ErrorHandling(res)) {
        res = res["body"]["body"];
        console.log(res);
        for (var key in res) {
          // check if the property/key is defined in the object itself, not in parent
          if (res.hasOwnProperty(key)) {
            localStorage.setItem(key, res[key]);
          }
        }

        uid = localStorage.getItem("Token");
        getCompanybyUsersEmail(localStorage.getItem("Mail"), uid, true);
        analytics.logEvent("login", { method: "Email", UID: uid });
        analytics.setUserProperties({ UID: localStorage.getItem("Token") });

        console.log(localStorage.getItem("Mail"));
      } else {
        hidespinner();
      }
    })
    .catch(function (error) {
      alert("בעיה עם הפרטים, אנא בדקו ונסו שוב");
      hidespinner();
    });
}

var getCompanybyUsersEmail = function (Email, Token, needtoredirect) {
  // get the company by user's email

  const URL = BASE + "/company?email=" + Email + "&token=" + Token;
  const otherPram = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    method: "GET",
  };
  fetch(URL, otherPram)
    .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
    .then((res) => {
      if (res.status < 400) {
        company = res["body"]["body"];
        localStorage.setItem("Company", JSON.stringify(company));

        getuserfromdb(needtoredirect);
      } else {
        window.open("createcompany.html?fullname=", "_self");
      }
    })
    .catch(function (error) {
      showerror(error);
    });
};

var getKeys = function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }
  return keys;
};

function getcurrentCompany() {
  Company = localStorage.getItem("Company");
  Company = JSON.parse(Company);
  return Company;
}

function putCompanyDeatials() {
  // put the deatials of a company on the page
  Company = getcurrentCompany();

  document.getElementById("companyid").innerHTML = Company.CompanyID;
  document.getElementById("companyname").innerHTML = Company.CompanyName;
  document.getElementById("companyphone").innerHTML = Company.CompanyPhone;
  document.getElementById("companycity").innerHTML = Company.CompanyCity;
  document.getElementById("companystreet").innerHTML = Company.CompanyStreet;
  document.getElementById("companycomment").innerHTML = Company.CompanyComment;
  document.getElementById("userfullname").innerHTML =
    getusernamefromlocalStorage();
  document.getElementById("mail").innerHTML = localStorage.getItem("Mail");
  document.getElementById("token").innerHTML = localStorage.getItem("Token");
}

function checkuser() {
  // check if user is loged in
  uid = localStorage.getItem("Token");
  email = localStorage.getItem("Mail");
  if (uid == null || email == null) {
    window.open(loginpageulr, "_self");
  }
}

function moreDetails(event) {
  showspinner();

  var node = event.target;

  localStorage.setItem("OrderNo", node.parentNode.id);
  let myData = localStorage.getItem(node.parentNode.id);
  myData = JSON.parse(myData);
  document.querySelector("#popup-container").style.display = "flex";
  // document.querySelector(".order-model").style.display = "flex";

  putOrderDeatails(myData);

  hidespinner();

  document.body.style = "overflow: hidden;margin: 0;";
}

function appendDistributors() {
  // appends the distributors to the list
  var src = document.getElementById("distributor");

  distributors = getactivedistributor();

  for (var key in distributors) {
    // check if the property/key is defined in the object itself, not in parent

    if (distributors.hasOwnProperty(key)) {
      distributor = distributors[key];
      option = document.createElement("option");

      var keys = Object.keys(distributor);
      var values = keys.map(function (key) {
        if (key == "DBName") {
          option.value = distributor[key];
          // if (distributor[key] == "ZigZagToday" || distributor[key] == "GetPackageExpress")
          //     option.disabled = true;
        } else if (key == "DisplayName") {
          option.innerText = distributor[key];
        }
      });
    }

    src.appendChild(option);
  }
}

function copyToClipboard(element) {
  // copy a text to the clipboard
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}

function disbaleinputs(className, state) {
  var inputs = document.getElementsByClassName(className);

  for (var i = 0; i < inputs.length; i++) {
    inputs[i].disabled = state;
  }
  // check-sender
  btn_id = "btn-" + className + "-fav";
  document.getElementById(btn_id).disabled = state;
  checkbox = document.getElementById("exp-check-" + className);
  const moneycollect = document.getElementById("moneycollect");
  const buttons = document.getElementById("buttons");

  buttons.style.marginTop = "-50px";
  moneycollect.style.visibility = "hidden";

  if (state == false) {
    checkbox.style.display = "table";
  } else {
    checkbox.style.display = "none";
  }
}

function changeicon(id) {
  $("i", id).toggleClass("bx-minus bx-plus");
}

function changedir() {
  const from_me = document.querySelector("#to_target");
  const to_me = document.querySelector("#from_target");
  const target_to_target = document.querySelector("#from_target_to_target");

  receiverdata = getDataFromInputs("receiver");
  senderdata = getDataFromInputs("sender");

  if (from_me.classList.contains("active")) {
    clickbtndir(to_me.id);
    putDeatialsininput(receiverdata, "sender");
  } else if (to_me.classList.contains("active")) {
    clickbtndir(from_me.id);
    putDeatialsininput(senderdata, "receiver");
  } else {
    clickbtndir(target_to_target.id);
    putDeatialsininput(receiverdata, "sender");
    putDeatialsininput(senderdata, "receiver");
  }
}

function clickbtndir(id) {
  removeactive();
  addactive(id);
  clearformbyclassname("sender");
  clearformbyclassname("receiver");
  if (id == "to_target") {
    disbaleinputs("sender", true);
    disbaleinputs("receiver", false);
    putCompanyDeatials_trigger("sender");
  } else if (id == "from_target") {
    disbaleinputs("sender", false);
    disbaleinputs("receiver", true);
    putCompanyDeatials_trigger("receiver");
  } else {
    clearformbyclassname("sender");
    clearformbyclassname("receiver");
    disbaleinputs("sender", false);
    disbaleinputs("receiver", false);
  }
}

function clickbtndir_onupdate(id) {
  removeactive();
  addactive(id);

  OrderNo = localStorage.getItem("OrderNo");
  myData = localStorage.getItem(OrderNo);
  myData = JSON.parse(mydata);
  const DROPOFFPOINT = myData["DropOffPoint"];
  const PICKUPPOINT = myData["PickUpPoint"];

  receiverdata = getDataFromInputs("receiver");
  senderdata = getDataFromInputs("sender");

  if (id == "to_target") {
    disbaleinputs("sender", true);
    disbaleinputs("receiver", false);

    putinfoininputfromdb(PICKUPPOINT, "sender");
    putinfoininputfromdb(DROPOFFPOINT, "receiver");
  } else if (id == "from_target") {
    disbaleinputs("sender", false);
    disbaleinputs("receiver", true);

    putinfoininputfromdb(DROPOFFPOINT, "sender");
    putinfoininputfromdb(PICKUPPOINT, "receiver");
  } else {
    putinfoininputfromdb(PICKUPPOINT, "sender");
    putinfoininputfromdb(DROPOFFPOINT, "receiver");
    disbaleinputs("sender", false);
    disbaleinputs("receiver", false);
  }
}

function removeactive() {
  var state = localStorage.getItem("stateid");
  const element = document.getElementById(state);

  element.classList.remove("active");
}

function addactive(id) {
  var element = document.getElementById(id);
  element.className += " active";
  localStorage.setItem("stateid", id);
}

function putCompanyDeatialsininput(company, place) {
  document.getElementById(place + "name").value = company.CompanyName;
  document.getElementById(place + "address").value = company.CompanyStreet;
  document.getElementById(place + "city").value = company.CompanyCity;
  document.getElementById(place + "phone").value = company.CompanyPhone;
  document.getElementById(place + "email").value = localStorage.getItem("Mail");
  document.getElementById(place + "phone2").value = "";
  document.getElementById(place + "comment").value = company.CompanyComment;
}

function getDataFromInputs(place) {
  const Data = {
    name: document.getElementById(place + "name").value,
    address: document.getElementById(place + "address").value,
    city: document.getElementById(place + "city").value,
    phone: document.getElementById(place + "phone").value,
    email: document.getElementById(place + "email").value,
    phone2: document.getElementById(place + "phone2").value,
    comment: document.getElementById(place + "comment").value,
  };
  return Data;
}

function putDeatialsininput(data, place) {
  document.getElementById(place + "name").value = data.name;
  document.getElementById(place + "address").value = data.address;
  document.getElementById(place + "city").value = data.city;
  document.getElementById(place + "phone").value = data.phone;
  document.getElementById(place + "email").value = data.email;
  document.getElementById(place + "phone2").value = data.phone2;
  document.getElementById(place + "comment").value = data.comment;
}

function putinfoininputfromdb(data, place) {
  document.getElementById(place + "name").value = data.FullName;
  document.getElementById(place + "address").value = data.Address;
  document.getElementById(place + "city").value = data.City;
  document.getElementById(place + "phone").value = data.Phone;
  document.getElementById(place + "email").value = data.Mail;
  document.getElementById(place + "phone2").value = data.Phone2;
  document.getElementById(place + "comment").value = data.Comment;
}

function putCompanyDeatials_trigger(place) {
  Company = getcurrentCompany();
  putCompanyDeatialsininput(Company, place);
}

function createPageTrack(orderno) {
  const URL = BASE + "/getshippingbyorderno?orderno=" + orderno;
  const src = document.querySelector("#result");

  let htmlnotfound = ` <div class="container">
                                              
    <div class="card">
        <div class="d-block titlecard ">
                <h5>  <span class="text-primary font-weight-bold">#</span></h5>
        </div>
        <div class="d-block titlecard ">
            <h6 style= "color:red; font-size:20px">משלוח לא נמצא<i class="fas fa-exclamation-circle" ></i></h6>
        </div>
       
    </div>`;

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
        Shipment = res["body"]["body"];
        status = Shipment.ShipmentInfo.Status;
        type = Shipment.ShipmentInfo.Type;

        is_double = false;
        if (type == "גוביינא" || type == "כפולה") {
          is_double = true;
        }
        statusnum = getStatusNumbyName(status);
        console.log(is_double);
        if (statusnum < 6 && statusnum > 0) {
          console.log(Shipment);

          let html = ` <div class="container">
                                        <div class="card">
                                            <div class="d-block titlecard ">
                                                    <h5>מספר משלוח <span class="text-primary font-weight-bold">#${Shipment.ShipmentInfo.OrderNo}</span></h5>
                                            </div>
                                            <div class="row d-flex justify-content-between px-3 top detailsorder">
                                                <div class="d-flex flex-column text-sm-right" id = "data">
                                                    
                                                        <p class="mt-0 "> נוצר בתאריך: <span>${Shipment.ShipmentInfo.CreateDate}</span></p>                                          
                                                        <p class="mt-0 "> חברת שילחיות: <span>${Shipment.ShipmentInfo.Distributor.DisplayName}</span></p>                                          
                                                </div> 
                                             </div>
                                        
                                            <div class="row d-flex justify-content-center">
                                                <div class="col-12">
                                                    <ul id="progressbar" class="text-center">
                        
                                                        <li class="step step1" id="1">נוצר</li>
                                                        <li class="step step2" id="2">מוכן לאסיפה</li>
                                                        <li class="step step3" id="3">בדרך ליעד</li>
                                                        <li class="step step5" id="5">נמסר</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                </div>`;
          src.insertAdjacentHTML("beforeend", html);
          data = document.getElementById("data");

          if (is_double) {
            $("#progressbar li").css("width", "20%");

            double_src = document.getElementById("3");
            double = `<li class="step step4" id ="4" style = "width:20%">שליחות חלק 1 נמסרה</li> `;
            double_src.insertAdjacentHTML("afterend", double);
          }

          if (Shipment.ShipmentInfo.PickUpDate != "") {
            pickupdate = `<p class="mt-0"> נאסף בתאריך: <span>${Shipment.ShipmentInfo.PickUpDate}</span></p>`;

            data.insertAdjacentHTML("beforeend", pickupdate);
          }

          if (Shipment.ShipmentInfo.DeliveryDate != "") {
            deliverydate = `<p class="mt-0"> נמסר בתאריך: <span>${Shipment.ShipmentInfo.DeliveryDate}</span></p>`;

            data.insertAdjacentHTML("beforeend", deliverydate);
          }

          if (Shipment.ShipmentInfo.ExternalStatus != "") {
            externalstatus = `<p class="mt-0"> מספר משלוח אצל חברת שליחויות :<span>${Shipment.ShipmentInfo.Externalid}</span></p>`;

            data.insertAdjacentHTML("beforeend", externalstatus);
          }

          for (let i = 1; i <= statusnum; i++) {
            if (i == 4) {
              if (!is_double) {
                continue;
              }
            }
            const element = document.getElementById(String(i));
            console.log(element);
            element.className += " active";
          }
        } else if (statusnum == 7) {
          let html = ` <div class="container">
                                              
                <div class="card">
                    <div class="d-block titlecard ">
                            <h5>מספר משלוח <span class="text-primary font-weight-bold">#${Shipment.ShipmentInfo.OrderNo}</span></h5>
                    </div>
                    <div class="d-block titlecard ">
                        <h6 style= "color:red; font-size:20px"> משלוח זה מבוטל <i class="fas fa-times-circle" ></i></h6>
                    </div>
                   
                </div>`;
          src.insertAdjacentHTML("beforeend", html);
        } else if (statusnum == 6) {
          let html = ` <div class="container">
                                              
                <div class="card">
                    <div class="d-block titlecard ">
                            <h5>מספר משלוח <span class="text-primary font-weight-bold">#${Shipment.ShipmentInfo.OrderNo}</span></h5>
                    </div>
                    <div class="d-block titlecard ">
                        <h6 style= "color:#FDCD06; font-size:20px">ישנה בעיה במסירת משלוח זה <i class="fas fa-exclamation-triangle" ></i></h6>
                    </div>
                   
                </div>`;
          src.insertAdjacentHTML("beforeend", html);
        } else {
          src.insertAdjacentHTML("beforeend", htmlnotfound);
        }
      }
    })
    .catch(function (error) {
      src.insertAdjacentHTML("beforeend", htmlnotfound);
    });
}

function getStatusNumbyName(status) {
  if (status == "נוצר") return 1;
  else if (status == "מחכה לאיסוף") return 2;
  else if (status == "בדרך ליעד") return 3;
  else if (status == "נמסר") return 5;
  else if (status == "נמסרה שליחות חלק ראשון (שליחות כפולה)") return 4;
  else if (status == "בעיה במסירה") return 6;
  else if (status == "בוטל") return 7;
  else return 0;
}

function getordersnofromtable() {
  var myOrders = document.getElementsByClassName("OrderNo");

  ordersarray = [];
  for (i = 0; i < myOrders.length; i++) {
    ordersarray.push(myOrders[i].parentNode.id);
  }
  return ordersarray;
}

function tableToExcel() {
  wbout = workbook();
  saveAs(
    new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    }),
    "סיכום משלוחים.csv"
  );
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
  var view = new Uint8Array(buf); //create uint8array as viewer
  for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
  return buf;
}

function workbook() {
  var wb = XLSX.utils.book_new();
  wb.Props = {
    Title: "סיכום משלוחים",
    Subject: "משלוחים",
    Author: "Shipping 360",
    CreatedDate: new Date().toLocaleDateString(),
  };
  wb.SheetNames.push("סיכום משלוחים");

  var ws_data = [
    [
      "תאריך הזמנה",
      "מספר משלוח ",
      "כתובת איסוף",
      "שם שולח",
      "כתובת מסירה",
      "שם מקבל",
      "שליח",
    ],
  ];
  orders_no = getordersnofromtable();
  for (let num = 0; num < orders_no.length; num++) {
    ws_data.push(getDataOfShippingasarray(orders_no[num]));
    console.log(orders_no[num]);
  }

  var ws = XLSX.utils.aoa_to_sheet(ws_data);
  wb.Sheets["סיכום משלוחים"] = ws;
  var wbout = XLSX.write(wb, {
    bookType: "xlsx",
    type: "binary",
  });
  return wbout;
}

function getDataOfShippingasarray(OrderNo) {
  mydata = localStorage.getItem(OrderNo);
  myData = JSON.parse(mydata);
  const DROPOFFPOINT = myData["DropOffPoint"];
  const SHIPMENTINFO = myData["ShipmentInfo"];
  const PICKUPPOINT = myData["PickUpPoint"];
  let array = [
    SHIPMENTINFO.CreateDate,
    SHIPMENTINFO.OrderNo,
    PICKUPPOINT.Address + ", " + PICKUPPOINT.City,
    PICKUPPOINT.FullName,
    DROPOFFPOINT.Address + ", " + DROPOFFPOINT.City,
    DROPOFFPOINT.FullName,
    SHIPMENTINFO.Distributor.DisplayName,
  ];
  return array;
}

function add_click(id, firsttime, needloading) {
  window.open(
    "distributorsettings.html?distributor=" +
      id +
      "&firsttime=" +
      firsttime +
      "&needloading=" +
      needloading,
    "_self"
  );
}

function getdatafromquerystring(data_name) {
  // getting data from the query string
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const data = urlParams.get(data_name);
  return data;
}

function getdistributor(distributor_name) {
  // getting distributor from the distributors table in the db
  token = localStorage.getItem("Token");
  CompanyId = getCompanyID();
  const URL =
    BASE +
    "/distributor?distributor=" +
    distributor_name +
    "&token=" +
    token +
    "&companyid=" +
    CompanyId;
  console.log(URL);
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
        distributor = res["body"]["body"];

        localStorage.setItem("currentdistributor", JSON.stringify(distributor));
        needloading = getdatafromquerystring("needloading");
        createsettingspage(distributor, needloading);
      }
      hidespinner();
    })
    .catch(function (error) {
      showerror(error);
    });
}

function createsettingspage(distributor, isneedtobeloaded) {
  // rendering the settings page

  requiredfields = distributor.RequiredFields;

  distributor_name = distributor.DBName;
  Company = getcurrentCompany();
  distributor_db = Company.Distributors[distributor_name];
  if (isneedtobeloaded == "false") {
    distributor_db = [];
  }

  // source
  var src = document.getElementById("fromsettings");

  for (var key in requiredfields) {
    if (requiredfields.hasOwnProperty(key)) {
      field = requiredfields[key];
      if (isneedtobeloaded == "false") {
        distributor_db[field] = "";
        console.log(distributor_db[field]);
      }

      let html = ` 
            <div class="form-group row">
                <div class="col-sm-12 input-field">

                    <input type="text" class="form-control" id="${field}" placeholder="${field}"
                      value="${distributor_db[field]}" required>
                </div>

            </div>`;
      src.insertAdjacentHTML("afterbegin", html);
    }
  }
  console.log(distributor);
  let html = `<h3 style="text-align:center; margin-bottom: 60px;">הגדרות עבור ${distributor.DisplayName}</h3>`;
  src.insertAdjacentHTML("afterbegin", html);
}

function adddistributorttocompany() {
  // adding a new distributort to company
  showspinner();
  const URL = BASE + "/adddistributortocompany";
  distributordb = localStorage.getItem("currentdistributor");
  distributordb = JSON.parse(distributordb);
  distributorid = distributordb["Id"];

  let Data = {
    distributorid: distributorid,
    uid: localStorage.getItem("Token"),
  };

  inputs = document.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    Data[inputs[i].placeholder] = inputs[i].value;
  }

  const otherPram = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(Data),
    method: "POST",
  };

  fetch(URL, otherPram)
    .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
    .then((res) => {
      if (ErrorHandling(res)) {
        distributors = res["body"]["body"];
        Company = getcurrentCompany();
        for (key in distributors) {
          Company["Distributors"][distributors[key].DBName] = distributors[key];
        }
        localStorage.setItem("Company", JSON.stringify(Company));
        analytics.logEvent("a distributor is add", {
          email: localStorage.getItem("Mail"),
          DBName: distributors[key].DBName,
        });
        analytics.setUserProperties({ UID: localStorage.getItem("Token") });

        window.open("myconnections.html", "_self");
      }
    })
    .catch(function (error) {
      console.log(error);
      showerror(error);
    });

  hidespinner();
}

function distributorsettingspage() {
  distributor_name = getdatafromquerystring("distributor");
  IsFisrtTime = getdatafromquerystring("firsttime");
  console.log(IsFisrtTime);

  if (distributor_name != null) {
    console.log(distributor_name);
    getdistributor(distributor_name);
  } else {
    window.open("myconnections.html", "_self");
  }

  if (IsFisrtTime == "true") {
    if (checkfordistributorincompany(distributor_name)) {
      // show pop up
      document.onreadystatechange = () => {
        if (document.readyState === "complete") {
          // document ready
          showpopup("DistributorModal");
        }
      };
    } else {
    }
  } else {
  }
}

function checkfordistributorincompany(distributor_name) {
  Company = getcurrentCompany();
  distributor = Company.Distributors[distributor_name];
  if (distributor == undefined) return false;
  else return true;
}

function addshowifactive(distributor_name) {
  console.log(distributor_name);
  elem = document.getElementById(distributor_name);
  add = elem.getElementsByClassName("add");
  remove = elem.getElementsByClassName("remove");
  check = elem.getElementsByClassName("check");
  settings = elem.getElementsByClassName("settings");

  check[0].classList.add("show");
  add[0].classList.remove("show");
  remove[0].classList.add("show");
  settings[0].classList.add("show");
}

function getactivedistributor() {
  Company = getcurrentCompany();
  distributors = Company.Distributors;

  active_distributors = [];
  for (var key in distributors) {
    if (distributors.hasOwnProperty(key)) {
      if (distributors[key].IsActive) {
        distributor = distributors[key];
        active_distributors.push(distributor);
      }
    }
  }

  return active_distributors;
}

function ArrangeConnectionsPage() {
  distributors = getactivedistributor();
  console.log(distributors);
  for (key in distributors) {
    if (!distributors[key].IsCustom) {
      distributor_name = distributors[key].DBName;
      if (distributor_name != "GetPackageExpress")
        // distributors that have two recordes on db but just one in the cards
        addshowifactive(distributor_name);
    }
  }
}

function CheckExsitsingDistributor(DBName) {
  // checking if the company alerdy have data about this distributor
  Company = getcurrentCompany();

  distributors = Company.Distributors;
  if (distributors.hasOwnProperty(DBName)) {
    return true;
  }
  return false;
}

function loadDisToform() {
  // loading distributor data from company to form - when user says that he wanna use the data form the db
  closepopup("DistributorModal");
  distributor_name = getdatafromquerystring("distributor");
  Company = getcurrentCompany();
  distributor = Company.Distributors[distributor_name];
  distributordb = localStorage.getItem("currentdistributor");
  distributordb = JSON.parse(distributordb);
  required_fields = distributordb["RequiredFields"];
  console.log(required_fields);
  for (key in required_fields) {
    if (required_fields.hasOwnProperty(key)) {
      field = required_fields[key];
      document.getElementById(field).value = distributor[field];
    }
  }
}

function remove_distributor_click(id) {
  // disabling a distributor by his id
  closepopup("RemoveDistributor");
  showspinner();
  const URL = BASE + "/removedistributorfromcompany";

  const Data = {
    token: localStorage.getItem("Token"),
    companyid: getCompanyID(),
    distributorname: id,
  };
  console.log(Data);

  const otherPram = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(Data),
    method: "PUT",
  };
  fetch(URL, otherPram)
    .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
    .then((res) => {
      if (ErrorHandling(res)) {
        distributors_name_to_unactive = res["body"]["body"];
        Company = getcurrentCompany();
        for (key in distributors_name_to_unactive) {
          distributor_name = distributors_name_to_unactive[key];
          Company.Distributors[distributor_name].IsActive = false;
        }

        localStorage.setItem("Company", JSON.stringify(Company));
        location.reload();
      }
      hidespinner();
    })
    .catch(function (error) {
      showerror(error);
      hidespinner();
      location.reload();
    })
    .always(function () {});
}

function getUsersfromlocalStorage() {
  // get the username from the local storage
  Company = getcurrentCompany();
  users = Company.UNE;

  for (var key in users) {
    // check if the property/key is defined in the object itself, not in parent
    if (users.hasOwnProperty(key)) {
      console.log(users[key]);
    }
  }
}

function createTableUsers(User) {
  src = document.getElementById("tbody");
  console.log(User);
  row = ` <tr id =${User.Token}>
            <td data-th="שם מלא">${User.Fullname}</td>
            <td data-th="מייל">${User.Mail}</td>
            <td data-th="טוקן">${User.Token}</td>
            <td data-th="תפקיד">${User.Role}</td>
            <td data-th="מחיקה" class = "remove-user"><span class='bx bxs-user-x delete-user'></span></td>
          </tr>`;
  src.insertAdjacentHTML("beforeend", row);
}

function getUsersToTable() {
  Company = getcurrentCompany();
  users = Company.UNE;
  for (key in users) {
    user = users[key];
    console.log(user);
    createTableUsers(user);
  }
}

function addusertocompany() {
  // adds a new user
  showspinner();
  const URL = BASE + "/addusertocompany";

  const user_email = document.getElementById("user-mail").value;
  const user_elem_password = document.getElementById("user-password");
  const user_password = user_elem_password.value;
  const user_fullname = document.getElementById("user-fullname").value;
  const user_role = document.getElementById("user-role").value;
  const companyid = getCompanyID();
  let uid = localStorage.getItem("Token");

  if (checkPassword(user_password)) {
    const Data = {
      companyid: companyid,
      fullname: user_fullname,
      email: user_email,
      role: user_role,
      password: user_password,
      creatortoken: uid,
    };

    const otherPram = {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(Data),
      method: "PUT",
    };

    fetch(URL, otherPram)
      .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
      .then((res) => {
        if (ErrorHandling(res)) {
          user_response = res["body"]["body"];
          user = {
            Fullname: user_response.fullname,
            Mail: user_response.email,
            Role: user_response.role,
            Token: user_response.token,
          };
          company = getcurrentCompany();
          company.UNE[user_response.token] = user;
          localStorage.setItem("Company", JSON.stringify(company));
          showpopup("modaluser");
          document.getElementById("modal-usermail").innerHTML = user_email;
          document.getElementById("modal-userpassword").innerHTML =
            user_password;
          analytics.logEvent("a new user is created", {
            email: user_email,
            Fullname: user.Fullname,
          });
          analytics.setUserProperties({ UID: user.Token });
        }
        hidespinner();
      })
      .catch(function (error) {
        showerror(error);
        hidespinner();
      });
  } else {
    showpopup("modalerror");
    user_elem_password.focus();
  }
}

function getuserfromdb(needtoredirect) {
  // getting uset from the users table in the db
  token = localStorage.getItem("Token");
  CompanyId = getCompanyID();
  const URL = BASE + "/users?companyid=" + CompanyId + "&token=" + token;
  console.log(URL);
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
        user = res["body"]["body"];

        localStorage.setItem("User", JSON.stringify(user));
        if (needtoredirect) {
          window.open("dashboard.html", "_self");
        }
      }
    })
    .catch(function (error) {
      showerror(error);
    });
}

function getcurrentuser() {
  User = localStorage.getItem("User");
  User = JSON.parse(User);
  return User;
}

function addfavorite(favoritedata) {
  // adds a new favorite
  const URL = BASE + "/favorite";

  const Data = getfavoritedatatofetch(favoritedata);

  console.log(Data);
  console.log(JSON.stringify(Data));
  console.log(URL);
  const otherPram = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(Data),
    method: "POST",
  };

  fetch(URL, otherPram)
    .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
    .then((res) => {
      if (ErrorHandling(res)) {
        console.log(res["body"]["body"]);

        favorite_response = res["body"]["body"];
        console.log(favorite_response);
        setfavoriteinuser(favorite_response);
        analytics.logEvent("a new favorite is created", {
          email: localStorage.getItem("Mail"),
          favid: favorite_response.Id,
        });
        analytics.setUserProperties({ UID: localStorage.getItem("Token") });
      }
      hidespinner();
    })
    .catch(function (error) {
      showerror(error);
      hidespinner();
    });
}

function getfavoritedatatofetch(favoritedata) {
  const Data = {
    fullname: favoritedata.name,
    address: favoritedata.address,
    city: favoritedata.city,
    phone: favoritedata.phone,
    phone2: favoritedata.phone2,
    mail: favoritedata.email,
    comment: favoritedata.comment,
    companyid: getCompanyID(),
    token: localStorage.getItem("Token"),
  };
  return Data;
}

function createTableFavorites(needdoubleclick) {
  User = getcurrentuser();
  Favorites = User.Favorites;
  for (key in Favorites) {
    fav = Favorites[key];
    addrowtotableFavorites(fav, needdoubleclick);
  }
}

function getfavoritedataforuserfromresponse(favorite_response) {
  favorite_data = {
    Address: favorite_response.Address + ", " + favorite_response.City,
    Fullname: favorite_response.Fullname,
    Id: favorite_response.Id,
  };
  return favorite_data;
}

function setfavoriteinuser(favorite_response) {
  user = getcurrentuser();
  id = String(favorite_response.Id);
  favorite_data = getfavoritedataforuserfromresponse(favorite_response);
  user.Favorites[id] = favorite_data;
  localStorage.setItem("User", JSON.stringify(user));
}

function addrowtotableFavorites(fav, needdoubleclick) {
  src = document.getElementById("tbody");
  row = ` <tr  id = "${fav.Id}" >
    <td data-th="מספר מזהה">${fav.Id}</td>
    <td data-th="שם מלא">${fav.Fullname}</td>
    <td data-th="כתובת מלאה">${fav.Address}</td>
  </tr>`;

  src.insertAdjacentHTML("beforeend", row);

  if (needdoubleclick) {
    tr = document.getElementById(fav.Id);
    tr.ondblclick = getfavtoinputs;
  } else {
    del = `<td data-th="מחיקה" class = "remove-favorite"><i class='bx bxs-bookmark-minus delete-favorite'></i></td>`;
    del_src = document.getElementById(fav.Id);

    del_src.insertAdjacentHTML("beforeend", del);
  }
}

function favbuttonclick(button) {
  var place = button.value;
  sessionStorage.setItem("placetoput", place);
  showpopup("favorite-popup");
}

function getfavoritedatabyid(id, place) {
  token = localStorage.getItem("Token");
  CompanyId = getCompanyID();
  const URL =
    BASE + "/favorite?companyid=" + CompanyId + "&token=" + token + "&id=" + id;
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
        favorite_data = res["body"]["body"];

        putFavDeatialsininput(favorite_data, place);
      }
      hidespinner();
    })
    .catch(function (error) {
      showerror(error);
      hidespinner();
    });
}

function getfavtoinputs(event) {
  showspinner();

  var node = event.target;
  id = node.parentNode.id;
  place = sessionStorage.getItem("placetoput");
  closepopup("favorite-popup");
  getfavoritedatabyid(id, place);
}

function putFavDeatialsininput(Favorite, place) {
  document.getElementById(place + "name").value = Favorite.Fullname;
  document.getElementById(place + "address").value = Favorite.Address;
  document.getElementById(place + "city").value = Favorite.City;
  document.getElementById(place + "phone").value = Favorite.Phone;
  document.getElementById(place + "email").value = Favorite.Mail;
  document.getElementById(place + "phone2").value = Favorite.Phone2;
  document.getElementById(place + "comment").value = Favorite.Comment;
}

function createFavoritefromfavpage() {
  showspinner();
  favoritedata = getDataFromInputs("favorite");
  addfavorite(favoritedata);
  clearformbyclassname("favorite");
  hidespinner();
  showpopup("NewFav");
}

function deleteuser(token) {
  // deletes a user
  const URL = BASE + "/deleteuser";
  company = getcurrentCompany();
  const Data = {
    token: token,
    companyid: getCompanyID(),
  };
  console.log(token);
  console.log(company);

  if (company["UNE"][token]["Role"] == CREATOR_ROLE) {
    showpopup("CantDeleteUser");
  } else {
    showspinner();
    const otherPram = {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(Data),
      method: "PUT",
    };

    fetch(URL, otherPram)
      .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
      .then((res) => {
        if (ErrorHandling(res)) {
          response = res["body"]["body"];
          Users = company["UNE"];
          if (Users.hasOwnProperty(response)) {
            delete Users[response];
            company["UNE"] = Users;
          }

          localStorage.setItem("Company", JSON.stringify(company));

          analytics.logEvent("a user is been deleted", {
            email: localStorage.getItem("Mail"),
          });
          analytics.setUserProperties({ UID: token });
        }
        hidespinner();
        location.reload();
      })
      .catch(function (error) {
        showerror(error);
        hidespinner();
      });
  }
}

function deletefavorite(id) {
  // deletes a favorite

  const URL = BASE + "/removefavorite";
  token = localStorage.getItem("Token");
  const Data = {
    token: token,
    companyid: getCompanyID(),
    id: id,
  };

  showspinner();
  const otherPram = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(Data),
    method: "PUT",
  };

  fetch(URL, otherPram)
    .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
    .then((res) => {
      if (ErrorHandling(res)) {
        response = res["body"]["body"];

        user = getcurrentuser();
        Favorites = user["Favorites"];
        if (Favorites.hasOwnProperty(response)) {
          delete Favorites[response];
          user["Favorites"] = Favorites;
        }
        localStorage.setItem("User", JSON.stringify(user));

        analytics.logEvent("a favorite is been deleted", {
          email: localStorage.getItem("Mail"),
        });
        analytics.setUserProperties({ UID: token });
        location.reload();
      }
      hidespinner();
    });
}

function addcustomdistributorttocompany() {
  // adding a new custom distributor to company
  showspinner();
  const URL = BASE + "/addcustomdistributortocompany";

  distributorname = document.getElementById("name-distributor").value;
  username = document.getElementById("username-distributor").value;
  password = document.getElementById("password-distributor").value;

  error = validateUsername(username);
  const src = document.getElementById("error-log");
  src.innerHTML = error;

  if (error == "") {
    let Data = {
      distributorname: distributorname,
      token: localStorage.getItem("Token"),
      companyid: getCompanyID(),
      username: username,
      password: password,
    };

    const otherPram = {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(Data),
      method: "PUT",
    };
    console.log(URL);
    fetch(URL, otherPram)
      .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
      .then((res) => {
        if (ErrorHandling(res)) {
          distributor_name = res["body"]["body"];
          Company = getcurrentCompany();
          distributors = Company["Distributors"];
          for (key in distributors) {
            Company["Distributors"][distributor_name] = {
              IsActive: true,
              DBName: distributor_name,
              IsCustom: true,
              DisplayName: distributor_name,
              Username: username,
              Password: password,
            };
          }
          localStorage.setItem("Company", JSON.stringify(Company));

          showpopup("modaldistributor");
          document.getElementById("modal-username").innerHTML = username;
          document.getElementById("modal-password").innerHTML = password;

          analytics.logEvent("a new distributor is add", {
            email: localStorage.getItem("Mail"),
            DBName: distributor_name,
          });
          analytics.setUserProperties({ UID: localStorage.getItem("Token") });
        }
        hidespinner();
      })
      .catch(function (error) {
        showerror(error);

        hidespinner();
      });
  } else {
    hidespinner();
    showpopup("modalerror");
  }
}

function createTableDistributors() {
  Company = getcurrentCompany();
  Distributors = Company["Distributors"];
  for (key in Distributors) {
    distributor = Distributors[key];
    if (distributor.IsActive) {
      addrowtotableDistributors(distributor);
    }
  }
}

function addrowtotableDistributors(distributor) {
  src = document.getElementById("tbody");
  row = ` <tr  id = "${distributor.DBName}" >
    <td data-th="שם המפיץ">${distributor.DisplayName}</td>
    <td data-th="מחיקה" class = "remove-distributor"><i class='bx bx-trash delete-distributor'></i></td>
  </tr>`;
  src.insertAdjacentHTML("beforeend", row);
}

function getlinkidfrombody() {
  body = document.getElementsByTagName("body");
  if (body != undefined) {
    id = body[0].id;
    localStorage.setItem("nav-link-id", id + "-link");
  }
}

function updateuser() {
  // updates a user
  const URL = BASE + "/users";
  company = getcurrentCompany();
  user = getcurrentuser();
  token = localStorage.getItem("Token");

  const Data = {
    token: token,
    companyid: getCompanyID(),
    fullname: document.getElementById("userfullname").value,
  };

  const otherPram = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(Data),
    method: "PUT",
  };

  fetch(URL, otherPram)
    .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
    .then((res) => {
      if (ErrorHandling(res)) {
        fullname = res["body"]["body"];
        User_in_company = company["UNE"][token];
        User_in_company["Fullname"] = fullname;
        company["UNE"][token] = User_in_company;

        user.Fullname = fullname;

        localStorage.setItem("User", JSON.stringify(user));

        localStorage.setItem("Company", JSON.stringify(company));

        analytics.logEvent("a user is been updated", {
          email: localStorage.getItem("Mail"),
        });
        analytics.setUserProperties({ UID: token });
      }
      hidespinner();
      window.open("mydetails.html", "_self");
    })
    .catch(function (error) {
      showerror(error);
      hidespinner();
    });
}

function updateCompany() {
  // updates a user
  const URL = BASE + "/company";
  company = getcurrentCompany();

  companyname = document.getElementById("companyname").value;
  street = document.getElementById("companystreet").value;
  city = document.getElementById("companycity").value;
  phone = document.getElementById("companyphone").value;
  comment = document.getElementById("companycomment").value;
  token = localStorage.getItem("Token");

  const Data = {
    token: token,
    companyid: getCompanyID(),
    companycity: city,
    companycomment: comment,
    companyname: companyname,
    companyphone: phone,
    companystreet: street,
  };

  console.log(Data);
  const otherPram = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(Data),
    method: "PUT",
  };

  fetch(URL, otherPram)
    .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
    .then((res) => {
      if (ErrorHandling(res)) {
        response = res["body"]["body"];
        company.CompanyCity = city;
        company.CompanyComment = comment;
        company.CompanyName = companyname;
        company.CompanyPhone = phone;
        company.CompanyStreet = street;

        localStorage.setItem("Company", JSON.stringify(company));

        analytics.logEvent("a company is been updated", {
          email: localStorage.getItem("Mail"),
        });
        analytics.setUserProperties({ UID: token });
      }
      hidespinner();
      window.open("mydetails.html", "_self");
    })
    .catch(function (error) {
      showerror(error);
      hidespinner();
    });
}

function getcurrentuseraccess() {
  user = getcurrentuser();
  role = user.Role;
  return admin_array.includes(role);
}

function checkforfreetrial() {
  Company = getcurrentCompany();
  IsFreeTrial = Company.IsFreeTrial;
  NextPayment = Company.NextPayment;
  NextPayment = new Date(NextPayment);

  daysleft = calthedaysleft(NextPayment);
  if (daysleft >= 0) {
    if (IsFreeTrial) {
      if (daysleft <= 10) {
        addcontenttobanner(daysleft);
        banner = $("#free-trial");
        banner.css({ visibility: "visible" });
        mainpanel = $(".main-panel");
        mainpanel.css({ "margin-top": "50px" });
      }
    }
  } else {
    // need to set a page for payment
  }
}

function calthedaysleft(next_pay) {
  today = new Date(today);
  return Math.round((next_pay - today) / oneDay);
}

function addcontenttobanner(daysleft) {
  const src = document.querySelector("#trial-banner");

  content = ``;

  if (daysleft >= 2) {
    content = `תקופת ניסיון החינם שלך מסתיימת בעוד ${daysleft} ימים.`;
  } else {
    content = `.תקופת ניסיון החינם שלך מסתיימת בעוד יום אחד`;
  }
  src.insertAdjacentHTML("afterbegin", content);
}

function addbanner() {
  const src = document.querySelector(".wrapper");

  html = `<div class="top-trial-banner" id ="free-trial" >
              <div class="trial-banner" id = "trial-banner">
                 
                  <a class = "pay" href="myusers.html">שלם עכשיו</a>
                  <span class="close-banner" id = "close-banner" onclick="closebanner()">&times;</span>
              </div>
          </div>`;

  src.insertAdjacentHTML("afterbegin", html);
}

function closebanner() {
  var result = $("#free-trial");
  result.remove();
  mainpanel = $(".main-panel");
  mainpanel.css({ "margin-top": "0px" });
}

function resetpassword() {
  const URL = BASE + "/resetpassword";

  const email = document.getElementById("mail").value;

  const Data = {
    email: email,
  };

  const otherPram = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(Data),
    method: "POST",
  };

  fetch(URL, otherPram)
    .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
    .then((res) => {
      if (ErrorHandling(res)) {
        document.getElementById("confirm-mail").style.visibility = "visible";

        clearformbyclassname("mail");
      }
      hidespinner();
    })
    .catch(function (error) {
      showerror(error);
      hidespinner();
    });
}

function check_dir_for_distributor(id) {
  if (id == "from_target" || id == "from_target_to_target") {
    Array.from(document.getElementById("distributor").options).forEach(
      function (option_element) {
        let option_value = option_element.value;
        let is_option_selected = option_element.selected;
        if (just_to_target_list.includes(option_value)) {
          option_element.disabled = true;
          if (is_option_selected) {
            document.getElementById("distributor").value = "";
          }
        }
      }
    );
  } else {
    Array.from(document.getElementById("distributor").options).forEach(
      function (option_element) {
        let option_value = option_element.value;
        if (just_to_target_list.includes(option_value)) {
          option_element.disabled = false;
        }
      }
    );
  }
}

function printShipping(ordersArray) {
  const URL = BASE + "/printshipping";

  token = localStorage.getItem("Token");

  const Data = {
    token: token,
    orderNos: ordersArray,
  };

  const otherPram = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(Data),
    method: "PUT",
  };

  fetch(URL, otherPram)
    .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
    .then((res) => {
      if (ErrorHandling(res)) {
      }
      hidespinner();
      location.reload();
    })
    .catch(function (error) {
      showerror(error);
      hidespinner();
    });
}
