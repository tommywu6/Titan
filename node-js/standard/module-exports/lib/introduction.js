//以function實作class
module.exports = function(name,age){
  this.name = name;
  this.age = age;
  this.about = () => {
    console.log(name+' is '+age+' years old');
  };
  this.ans = () => {
    return 'apple';
  }
};