export function foreach(arr, cb) {
  for (var i = 0, l = arr.length; i < l; i++) {
    var result = cb && cb(arr[i], i);
    if (result !== undefined) {
      if (result === 0) {
        continue;
      } else if (result === -1) {
        break;
      } else {
        return arr[i];
      }
    }
  }
}