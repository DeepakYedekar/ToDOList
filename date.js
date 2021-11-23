exports.getdate=function (){
const today=new Date();


const object={
weekday:"long",
day:"numeric",
year:"numeric",
month:"long"
};

 return today.toLocaleDateString("en-us",object);

};

exports.getday=function (){
const today=new Date();
const object={
weekday:"long",
};

return today.toLocaleDateString("en-us",object);

};
