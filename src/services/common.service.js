
export const getQuery = (obj) => {
    let str;
    str = [];
    for (const p in obj) {

      if (obj.hasOwnProperty(p) && obj[p]) {


        if (typeof obj[p] === 'object') {

          obj[p].forEach(item => {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(item));
          });

        } else {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }

      }



    }
    return str.join('&');
  }