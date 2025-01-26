let side;

(function ($) {
  "use strict"; // Start of use strict
  activateActivityTracker();

  $(document).ready(function () {
    side = document.getElementById("sidebar");
    if (side != undefined) {
      $(function () {
        getlinkidfrombody();
        loadsidebar();
      });

      $(function () {
        loadnavbar();
      });

      $(function () {
        $(".navbar-toggler").click(function (e) {
          e.preventDefault();
        });
      });
    }
  });
})(jQuery);

function loadnavbar() {
  src = document.getElementById("navbar");
  fullname = getusername();
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
                    <a class="nav-link" id="distributor-home-link" href="distributor-home.html">
                        <p> <span class='bx bxs-home'></span>דף הבית</p>
    
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="orderssummary-distibutor-link" href="orderssummary-distibutor.html">
                        <p> <span class='bx bx-library'></span>המשלוחים שלי</p>
    
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="mydetails-distributor-link" href="mydetails-distributor.html">
    
                        <p> <span class='bx bxs-user-account'></span>הפרטים שלי</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="updatepassword-distributor-link" href="updatepassword-distributor.html">
    
                        <p> <span class='bx bx-lock-alt'></span>עדכון סיסמא</p>
                    </a>
                </li>
                
          
            </div>
            
            <li class="nav-item gototop">
              <a class="nav-link" id="link" href="#top">
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

function getorderbyorderno(orderno) {
  showspinner();
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
        Shipment = res["body"]["body"];
        console.log(Shipment);
        orderno = Shipment["ShipmentInfo"]["OrderNo"];
        DBName = Shipment["ShipmentInfo"]["Distributor"]["DBName"];
        if (DBName == getdistributorname()) {
          localStorage.setItem(orderno, JSON.stringify(Shipment));
          putOrderDeatails(Shipment);
          showpopup("orderdetails");
          document.getElementById("updateDetails").style.display = "block";
          document.getElementById("pickedup").style.display = "block";
          document.getElementById("delivered").style.display = "block";
        } else {
          showpopup("modalerror");
          const src = document.getElementById("error-log");
          src.innerHTML = "אין לך גישה למשלוח שאינו שלך";
        }
      }
      hidespinner();
    })
    .catch(function (error) {
      alert(error);
      hidespinner();
    });
}

function updatedata() {
  // update the data of specific shipment

  PickUpDate = document.getElementById("PickUpDate").value;
  DeliveryDate = document.getElementById("DeliveryDate").value;
  Status = document.getElementById("status").value;
  updatedatawithparm(PickUpDate, DeliveryDate, Status);
}

function loaddata() {
  // load data and put it in a table
  showspinner();
  switchEmptyState(false);

  lastid = localStorage.getItem("lastid");
  compnayId = localStorage.getItem("CompanyId");
  let username = getusername();
  let password = getpassword();
  let distributorname = getdistributorname();

  const URL =
    BASE +
    "/shippingdistributor?lastid=" +
    lastid +
    "&recordsnumtoshow=" +
    tablerecordsnumtoshow +
    "&companyid=" +
    compnayId +
    "&username=" +
    username +
    "&password=" +
    password +
    "&distributorname=" +
    distributorname;

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
        last_id = res["body"]["message"];
        if (last_id == -1) {
          document.getElementById("btn_showmore").style = "visibility: hidden;";
        }
        localStorage.setItem("lastid", last_id);
        data = res["body"]["body"];
        if (Object.keys(res).length === 0 && res.constructor === Object) {
          // checking if empty
          switchEmptyState(true);
        }

        for (var key in data) {
          // check if the property/key is defined in the object itself, not in parent
          if (data.hasOwnProperty(key)) {
            localStorage.setItem(key, JSON.stringify(data[key]));
            console.log(data[key]);
            createTable(data[key]);
          }
        }
      }
      hidespinner();
    })
    .catch(function (error) {
      alert("Got an error:" + error);
      hidespinner();
    });
}

function createTable(data) {
  var src = document.getElementById("tbody");
  const DROPOFFPOINT = data["DropOffPoint"];
  const SHIPMENTINFO = data["ShipmentInfo"];
  const PICKUPPOINT = data["PickUpPoint"];
  orderNo = SHIPMENTINFO.OrderNo;
  row = ` <tr class = "trbody" value = "${orderNo}" id = "${orderNo}">
            <td data-th="תאריך הזמנה">${SHIPMENTINFO.CreateDate}</td>
            <td class = "OrderNo" data-th="מספר הזמנה">${orderNo}</td>
            <td data-th="שולח">${PICKUPPOINT.FullName}, ${
    PICKUPPOINT.Address + ", " + PICKUPPOINT.City
  } - ${PICKUPPOINT.Phone}</td>
            <td data-th="מקבל">${DROPOFFPOINT.FullName}, ${
    DROPOFFPOINT.Address + ", " + DROPOFFPOINT.City
  } - ${DROPOFFPOINT.Phone}</td>
            <td data-th="סטטוס">${SHIPMENTINFO.Status}</td>
            <td data-th="מפיץ">${SHIPMENTINFO.Distributor.DisplayName}</td>
            <td data-th= "בחר">
                <input class="check-single" type="checkbox" id="check-${orderNo}" value="${orderNo}">
            </td>
          </tr>`;
  src.insertAdjacentHTML("beforeend", row);
  tr = document.getElementById(orderNo);
  tr.ondblclick = moreDetails;
}

function moreDetails(event) {
  showspinner();

  var node = event.target;

  let myData = localStorage.getItem(node.parentNode.id);
  myData = JSON.parse(myData);
  document.querySelector("#popup-container").style.display = "flex";

  putOrderDeatails(myData);

  hidespinner();

  document.body.style = "overflow: hidden;margin: 0;";
}

function loaddatabydate(datefrom, dateto) {
  // load data between dates and put it in a table
  showspinner();
  switchEmptyState(false);
  document.getElementById("tbody").innerHTML = "";
  var btn = document.getElementById("btn_showmore");
  btn.css = "visibility: visible;";
  btn.innerHTML = "אפס";
  $("#btn_showmore").on("click", function () {
    document.getElementById("tbody").innerHTML = "";
    localStorage.setItem("lastid", 0);
    btn.innerHTML = "הצג עוד";
  });

  lastid = localStorage.getItem("lastid");
  compnayId = localStorage.getItem("CompanyId");
  let username = getusername();
  let password = getpassword();
  let distributorname = getdistributorname();
  const URL =
    BASE +
    "/getshippingdistributorbydates?from=" +
    datefrom +
    "&to=" +
    dateto +
    "&companyid=" +
    compnayId +
    "&username=" +
    username +
    "&password=" +
    password +
    "&distributorname=" +
    distributorname;
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
        res = res["body"]["body"];

        if (Object.keys(res).length === 0 && res.constructor === Object) {
          // checking if empty
          switchEmptyState(true);
        }

        for (var key in res) {
          // check if the property/key is defined in the object itself, not in parent
          if (res.hasOwnProperty(key)) {
            shipment = res[key];
            localStorage.setItem(key, JSON.stringify(shipment));
            console.log(shipment["ShipmentInfo"]["OrderNo"]);
            createTable(shipment);
          }
        }
      }
      hidespinner();
    })
    .catch(function (error) {
      alert("Got an error:" + error);
      hidespinner();
    });
}

function login() {
  // login a user to the system
  showspinner();
  const URL = BASE + "/logindistributor";

  const companyid = document.getElementById("companyid").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const Data = {
    companyid: Number(companyid),
    username: username,
    password: password,
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
        Distributor = res["body"]["body"];
        console.log(Distributor);
        localStorage.setItem("CompanyId", companyid);
        localStorage.setItem("Distributor", JSON.stringify(Distributor));

        window.open("distributor-home.html", "_self");
      } else {
        hidespinner();
      }
    })
    .catch(function (error) {
      alert("בעיה עם הפרטים, אנא בדקו ונסו שוב");
      hidespinner();
    });
}

function getDistributor() {
  Distributor = localStorage.getItem("Distributor");
  Distributor = JSON.parse(Distributor);
  return Distributor;
}

function getusername() {
  Distributor = getDistributor();
  return Distributor.Username;
}

function getpassword() {
  Distributor = getDistributor();
  return Distributor.Password;
}

function getdistributorname() {
  Distributor = getDistributor();
  return Distributor.DBName;
}

function checkdistributor() {
  Distributor = localStorage.getItem("Distributor");
  Distributor = JSON.parse(Distributor);
  if (Distributor == null) {
    window.open("logindistributor.html", "_self");
  } else if (
    Distributor.DBName == null ||
    Distributor.Username == null ||
    Distributor.Password == null
  ) {
    window.open("logindistributor.html", "_self");
  }
}

function pickedup() {
  showspinner();
  PickUpDate = today;
  DeliveryDate = "";
  Status = "בדרך ליעד";
  updatedatawithparm(PickUpDate, DeliveryDate, Status);
  showpopup("pickedupmodal");
}

function updatedatawithparm(PickUpDate, DeliveryDate, Status) {
  const URL = BASE + "/shippingdistributor";

  orderno = localStorage.getItem("OrderNo");
  let Shipment = localStorage.getItem(orderno);
  Shipment = JSON.parse(Shipment);

  if (PickUpDate != "" && DeliveryDate != "" && Status != "") {
  } else {
    let SHIPMENTINFO = Shipment["ShipmentInfo"];

    if (PickUpDate == "") {
      PickUpDate = SHIPMENTINFO.PickUpDate;
    }
    if (DeliveryDate == "") {
      DeliveryDate = SHIPMENTINFO.DeliveryDate;
    }
    if (Status == "") {
      Status = SHIPMENTINFO.Status;
    }
  }

  const Data = {
    orderno: orderno,
    pickupdate: PickUpDate,
    deliverydate: DeliveryDate,
    status: Status,
    companyid: localStorage.getItem("CompanyId"),
    username: getusername(),
    password: getpassword(),
    distributorname: getdistributorname(),
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

        Shipment.ShipmentInfo.PickUpDate = PickUpDate;
        Shipment.ShipmentInfo.DeliveryDate = DeliveryDate;
        Shipment.ShipmentInfo.Status = Status;

        localStorage.setItem(orderno, JSON.stringify(Shipment));
      }
      hidespinner();
    })
    .catch(function (error) {
      alert("Got an error:" + error);
      hidespinner();
    });
}

function UploadPhotoToShipment(base64_url) {
  showspinner();
  orderno = localStorage.getItem("OrderNo");
  const URL = BASE + "/uploadphototoshipmentdistributor";

  let Shipment = localStorage.getItem(orderno);
  Shipment = JSON.parse(Shipment);
  const Data = {
    orderno: orderno,
    photobase64: base64_url,
    companyid: localStorage.getItem("CompanyId"),
    username: getusername(),
    password: getpassword(),
    distributorname: getdistributorname(),
  };

  let otherPram = {
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
        photo_url = response.photo;

        Shipment.ShipmentInfo.Photo = photo_url;
        Shipment.ShipmentInfo.DeliveryDate = today;
        Shipment.ShipmentInfo.Status = "נמסר";

        localStorage.setItem(orderno, JSON.stringify(Shipment));
        window.open("distributor-home.html", "_self");
      }
      hidespinner();
    })
    .catch(function (error) {
      alert("Got an error:" + error);
      hidespinner();
    });
}

function convertbloburltobase64(bloburl) {
  let otherPram = {
    headers: {
      "Content-Type": "application/octet-stream; charset=UTF-8",
    },
    method: "GET",
  };
  fetch(bloburl, otherPram)
    .then((r) => r.blob().then((data) => ({ status: r.status, body: data })))
    .then((res) => {
      base64_url = res["body"]["body"];
    })
    .catch(function (error) {
      alert("Got an error:" + error);
    });

  // var xhr = new XMLHttpRequest;
  // xhr.responseType = 'blob';
  // xhr.onload = function () {
  //     var recoveredBlob = xhr.response;

  //     var reader = new FileReader;

  //     reader.onload = function () {
  //         var blobAsDataUrl = reader.result;
  //         console.log(blobAsDataUrl)
  //     };

  //     reader.readAsDataURL(recoveredBlob);
  // };

  // xhr.open('GET', bloburl);
  // xhr.send();
}

function ResizeImage() {
  var filesToUpload = document.getElementById("imageFile").files;
  var file = filesToUpload[0];
  console.log(file);

  // Create an image
  var img = document.createElement("img");
  // Create a file reader
  var reader = new FileReader();
  // Set the image once loaded into file reader
  reader.onload = function (e) {
    img.src = e.target.result;

    var canvas = document.createElement("canvas");
    //var canvas = $("<canvas>", {"id":"testing"})[0];
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var MAX_WIDTH = 800;
    var MAX_HEIGHT = 800;
    var width = img.width;
    var height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    var dataurl = canvas.toDataURL("image/png, image/jpg");
    console.log(dataurl);
    document.getElementById("output").src = dataurl;
  };
  // Load files into file reader
  reader.readAsDataURL(file);
}

function putdistibutordetails() {
  document.getElementById("distributorname").innerHTML = getdistributorname();
  document.getElementById("distributorusername").innerHTML = getusername();
}

function updatedistributor() {
  showspinner();
  const URL = BASE + "/updatedistributor";

  new_username = document.getElementById("distributorusername").value;
  const Data = {
    newusername: new_username,
    companyid: localStorage.getItem("CompanyId"),
    oldusername: getusername(),
    password: getpassword(),
    distributorname: getdistributorname(),
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
        distributor = getdistributor();
        distributor.Username = new_username;
        localStorage.setItem("Distributor", JSON.stringify(distributor));
      }
      hidespinner();
    })
    .catch(function (error) {
      alert("Got an error:" + error);
      hidespinner();
    });
}

function updatepassword() {
  const URL = BASE + "/updatepassworddistributor";

  new_password = document.getElementById("password");
  password_again = document.getElementById("password-again");
  if (new_password.value == password_again.value) {
    if (checkPassword(new_password)) {
      showspinner();

      const Data = {
        newpassword: new_password.value,
        companyid: localStorage.getItem("CompanyId"),
        username: getusername(),
        oldpassword: getpassword(),
        distributorname: getdistributorname(),
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
        .then((r) =>
          r.json().then((data) => ({ status: r.status, body: data }))
        )
        .then((res) => {
          if (ErrorHandling(res)) {
            distributor = getdistributor();
            distributor.Password = new_password;
            localStorage.setItem("Distributor", JSON.stringify(distributor));
          }
          hidespinner();
        })
        .catch(function (error) {
          alert("Got an error:" + error);
          hidespinner();
        });
    }
  } else {
    password_again.value = "";
    document.getElementById("error-log").innerHTML =
      "הסיסמאות חייבות להיות שוות";
    showpopup("modalerror");
  }
}
