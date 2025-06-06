export function formUrlEncoded(obj: any, list?:string[], key?:number|string) {
  list = list || []; //Create list if we don't have one
  const isObj = typeof(obj) === "object";

  if (isObj){
    for (let p in obj){
      if (obj.hasOwnProperty(p)){
        formUrlEncoded(obj[p], list, key ? key + "[" + p + "]" : p);
      }
    }
  } else {
    list.push(key + "=" + encodeURIComponent(obj));
  }
  return list.join("&");
}
