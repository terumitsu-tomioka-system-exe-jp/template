const DB_NAME = "employeeDB";
const DB_VERSION = 1;
const STORE_NAME = "employees";
let db = null;

// DB接続（コールバックにDBインスタンスを渡す）
function openDb(callback) {
  if(db) { callback(db); return; }
  let request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onupgradeneeded = function(e) {
    const _db = e.target.result;
    if (!_db.objectStoreNames.contains(STORE_NAME)) {
      _db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
    }
  };
  request.onsuccess = function(e) {
    db = e.target.result;
    if(callback) callback(db);
  };
  request.onerror = function() { alert("DBオープン失敗"); };
}

// 社員一覧取得
function getEmployees(callback) {
  openDb(function(db) {
    let result = [];
    let tx = db.transaction(STORE_NAME, "readonly");
    let store = tx.objectStore(STORE_NAME);
    store.openCursor().onsuccess = function(e) {
      let cursor = e.target.result;
      if(cursor){
        result.push(cursor.value);
        cursor.continue();
      } else {
        callback(result);
      }
    };
  });
}

// 社員追加
function addEmployee(emp, callback) {
  openDb(function(db) {
    let tx = db.transaction(STORE_NAME, "readwrite");
    let store = tx.objectStore(STORE_NAME);
    let req = store.add(emp);
    req.onsuccess = function() { if(callback) callback(); };
  });
}

// 社員取得
function getEmployee(id, callback) {
  openDb(function(db) {
    let tx = db.transaction(STORE_NAME, "readonly");
    let store = tx.objectStore(STORE_NAME);
    let req = store.get(Number(id));
    req.onsuccess = function() { callback(req.result); };
  });
}

// 社員更新
function updateEmployee(emp, callback){
  openDb(function(db) {
    let tx = db.transaction(STORE_NAME, "readwrite");
    let store = tx.objectStore(STORE_NAME);
    store.put(emp).onsuccess = function() { if(callback) callback(); };
  });
}

// 社員削除
function deleteEmployee(id, callback) {
  openDb(function(db) {
    let tx = db.transaction(STORE_NAME, "readwrite");
    let store = tx.objectStore(STORE_NAME);
    store.delete(Number(id)).onsuccess = function() { if(callback) callback(); };
  });
}