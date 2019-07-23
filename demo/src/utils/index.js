import Cookie from "js-cookie";
//登录态  保存在cookie 中 十小时更新一次   登录态
let key="authorization";
export function setCookie(value){
    let date=new Date();
    let expries=date.getTime()+10*60*60*1000;
    date.setTime(expries)
    Cookie.set(key,value,{expires:date})
}

export function getCookie(){
    return Cookie.get(key);
}

export function removeCookie(){
  return  Cookie.remove(key);
}