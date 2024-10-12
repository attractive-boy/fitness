// 为图片加上http
export function addHttpIfMissing(text, http) {
  if (!text) return;
  if (!text.includes("http")) {
    // 如果字符串不包含 'http'，则在字符串前面添加 'http://127.0.0.1:8080'
    return http + text;
  } else {
    // 如果字符串包含 'http'，则直接返回原字符串
    return text;
  }
}

/**
 * 键值相同源赋给目标对象
 * @param {Object} source 源对象
 * @param {Object} target 目标对象
 */
export function mergeObjects(source, target) {
  for (let key in target) {
    if (source[key]) {
      target[key] = source[key];
    }
  }
  return target;
}

/**
 * 时间格式化
 * @param {Object} timestamps
 */

/**
 * 时间格式化
 * @param {Object} timestamps
 */
export function formatTimestamp(timestamp, type = 1) {
  if (!timestamp) return;
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hour = ("0" + date.getHours()).slice(-2);
  const minute = ("0" + date.getMinutes()).slice(-2);
  const second = ("0" + date.getSeconds()).slice(-2);
  if (type == 0) {
    return `${year}-${month}-${day}`;
  } else if (type == 1) {
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  } else if (type == 2) {
    return `${month}月${day}日`;
  } else if (type == 3) {
    return `${year}年${month}月${day}日`;
  } else if (type == 4) {
    return `${year}/${month}/${day}`;
  } else if (type == 5) {
    return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
  }
}

/**
 * @param {Object} source 源对象
 * @param {Object} rules 规则对象
 * 返回 提示文字
 */
export function validateObject(source, rules) {
  for (const key in rules) {
    if (rules.hasOwnProperty(key)) {
      const rule = rules[key].rule;
      const errorMsg = rules[key].msg;
      if (!validateRule(source[key], rule)) {
        return errorMsg;
      }
    }
  }

  return null; // 返回 null 表示验证通过
}

function validateRule(value, rule) {
  switch (rule) {
    case "empty":
      console.log(uni.$u.test.isEmpty(value), value);
      return !uni.$u.test.isEmpty(value);

    case "phone":
      return uni.$u.test.mobile(value);

    case "idCard":
      return uni.$u.test.idCard(value);
    default:
      return true; // 默认返回 true，即不应用规则
  }
}
/**
 * px 转 rpx
 */
export function rpxTopx(px) {
  let bi = 100 / uni.upx2px(100);
  return bi * px;
}

/**
 * 差值
 * @param {Object} time1
 * @param {Object} time2
 */
export function isDiffOver2Hours(time1, time2) {
  const twoHoursMs = 2 * 60 * 60 * 1000;
  const diff = Math.abs(time1.getTime() - time2.getTime());
  return diff > twoHoursMs;
}

export function fomartLifespan(num) {
  if (!num) return;
  if (num < 24) return num + "小时";
  if (num >= 24) return (num / 24).toFixed(0) + +"天";
}
