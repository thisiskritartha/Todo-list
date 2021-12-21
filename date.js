//module(module.exports.getDate) is equal to the function ( = getDate)
// module.exports.getDate
exports.getDate = function() { //Anonymous function doesn't have any function name
  const today = new Date();
  const option = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  let day = today.toLocaleDateString("en-US", option);
  return day;
}


//module(module.exports.getDay1) is equal to the function ( = getDay)
//module.exports.getDay1
exports.getDay1 = function() { //Anonymous Function

  const today = new Date();
  const option = {
    weekday: "long",

  };
  let day = today.toLocaleDateString("en-US", option);
  return day;
}
