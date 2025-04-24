import { Toast, Modal } from "bootstrap";

window.BlazorSelectTextElement = (element) => {
  if (element instanceof HTMLElement) {
    element.select();
  }
};

window.SetDropdownSelectedIndex = (element, index) => {
  if (element instanceof HTMLElement) {
    element.selectedIndex = index;
  }
};

window.BlazorDownloadFile = (filename, contentType, content) => {
  // Create the URL
  const file = new File([content], filename, { type: contentType });
  const exportUrl = URL.createObjectURL(file);

  // Create the <a> element and click on it
  const a = document.createElement("a");
  const appended = document.body.appendChild(a);
  a.href = exportUrl;
  a.download = filename;
  a.target = "_self";
  a.click();

  // We don't need to keep the object URL, let's release the memory
  // On older versions of Safari, it seems you need to comment this line...
  URL.revokeObjectURL(exportUrl);
  appended.remove();
};

window.cookieManager = {
  setCookie: function (name, value, days) {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie =
      name + "=" + value + expires + "; path=/; Secure; SameSite=Strict";
  },
  getCookie: function (name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  deleteCookie: function (name) {
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  },
};

window.indexedDbHelper = {
  openDb: function (dbName, version) {
    return new Promise((resolve, reject) => {
      let request = indexedDB.open(dbName, version);

      request.onsuccess = function (event) {
        resolve(event.target.result);
      };

      request.onerror = function (event) {
        reject("Error opening IndexedDB: " + event.target.errorCode);
      };

      request.onupgradeneeded = function (event) {
        let db = event.target.result;
        if (!db.objectStoreNames.contains("tokens")) {
          db.createObjectStore("tokens", { keyPath: "id" });
        }
      };
    });
  },

  saveItem: function (dbName, storeName, item, itemId) {
    return new Promise((resolve, reject) =>
      this.openDb(dbName, 1)
        .then((db) => {
          let transaction = db.transaction(storeName, "readwrite");
          let store = transaction.objectStore(storeName);

          let data = {
            id: itemId,
            item: item,
          };
          store.put(data);

          transaction.oncomplete = function () {
            resolve("Tokens saved successfully");
          };

          transaction.onerror = function () {
            reject("Error saving tokens");
          };
        })
        .catch(reject),
    );
  },

  getItem: function (dbName, storeName, itemId) {
    return new Promise((resolve, reject) =>
      this.openDb(dbName, 1)
        .then((db) => {
          let transaction = db.transaction(storeName, "readonly");
          let store = transaction.objectStore(storeName);

          let request = store.get(itemId);

          request.onsuccess = function (event) {
            resolve(event.target.result ? event.target.result.item : null);
          };

          request.onerror = function () {
            reject("Error getting token");
          };
        })
        .catch(reject),
    );
  },

  removeItem: function (dbName, storeName, itemId) {
    return new Promise((resolve, reject) =>
      this.openDb(dbName, 1)
        .then((db) => {
          let transaction = db.transaction(storeName, "readwrite");
          let store = transaction.objectStore(storeName);

          store.delete(itemId);

          transaction.oncomplete = function () {
            resolve("Token removed successfully");
          };

          transaction.onerror = function () {
            reject("Error removing token");
          };
        })
        .catch(reject),
    );
  },
};

window.deleteUserModal = {
  show: () =>
    Modal.getOrCreateInstance(
      document.getElementById("deleteUserModal"),
    ).show(),
  hide: () =>
    Modal.getOrCreateInstance(
      document.getElementById("deleteUserModal"),
    ).hide(),
};

window.deleteUserToast = {
  show: () =>
    Toast.getOrCreateInstance(
      document.getElementById("deleteUserToast"),
    ).show(),
};

window.showAlertModal = (id) =>
  Modal.getOrCreateInstance(document.getElementById(id)).show();

window.getWindowHeight = () => window.innerHeight;
window.getHeaderHeight = () => document.getElementById("header").offsetHeight;
window.getFooterHeight = () => document.getElementById("footer").offsetHeight;
window.getContentHeight = () =>
  window.getWindowHeight() -
  window.getHeaderHeight() -
  window.getFooterHeight();
