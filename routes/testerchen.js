let obj = {};

console.log("single: ", !obj);
console.log("double: ", !!obj);
if (Object.keys(obj).length === 0) {
    console.log('obj is empty');
  } else {
    console.log('obj is not empty');
  }

obj.value = 1;
console.log("single: ", !obj);
console.log("double: ", !!obj);


if (Object.keys(obj).length === 0) {
    console.log('obj is empty');
  } else {
    console.log('obj is not empty');
  }