function getData() {
  var data = localStorage.getItem("dropin");
  if (!data) return null;
  return JSON.parse(data);
}

function setData(data) {
  localStorage.setItem("dropin", JSON.stringify(data));
}

export function getLocalValue(name) {
  var data = getData();
  if (!data) return null;

  return data[name];
}

export function setLocalValue(name, value) {
  var data = getData() || {};
  data[name] = value;
  setData(data);
}

export function removeLocalValue(name) {
  var data = getData() || {};
  delete data[name];
  setData(data);
}
