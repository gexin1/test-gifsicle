import axios from "axios";
let i = 1;
setInterval(() => {
  i++;
  new Array(10).fill("").map((item, index) => {
    console.log(`发起个${index + i}测试请求`);
    axios.get("http://localhost:9991");
  });
}, 3000);
