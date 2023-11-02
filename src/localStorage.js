
// Get an item from localStorage
function get(key) {
  const item = localStorage.getItem(key);
  try {
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error parsing localStorage item with key ${key}: ${error}`);
    return null;
  }
}

// Set an item in localStorage
function set(key, value) {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error serializing value for localStorage item with key ${key}: ${error}`);
  }
}

export { get, set };