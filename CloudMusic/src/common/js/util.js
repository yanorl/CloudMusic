export function debounce (func, delay) {
  let timer
  return function (...args) {
    // console.log(args)
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// export function timeStamp (timestamp) {
//   var date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
//   var Y = date.getFullYear() + '-'
//   var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
//   var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
//   return (Y + M + D)
// }

export function durationStamp (timestamp) {
  timestamp = timestamp / 1000 | 0
  const minute = _pad(timestamp / 60 | 0)
  const second = _pad(timestamp % 60)
  return `${minute}:${second}`
}

export function _pad (num, n = 2) {
  let len = num.toString().length
  while (len < n) {
    num = '0' + num
    len++
  }
  return num
}

export function timeStamp (timestamp, boolean = false, time = false, dateTime = false) {
  var date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
  var h = ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())
  var m = ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  var s = ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  if (time) {
    return h + m
  } else if (dateTime) {
    return M + D + h + m
  } else {
    return boolean ? (Y + M + D + h + m + s) : (Y + M + D)
  }
}

export function timesFun (timesData) {
  var dateBegin = new Date(timeStamp(timesData, true).replace(/-/g, '/')) // new Date('2016-07-18 14:58:32').getTime() 在ios上死活拿不到时间戳显示NaN
  var dateEnd = new Date() // 获取当前时间
  var dateDiff = dateEnd.getTime() - dateBegin.getTime() // 时间差的毫秒数
  var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) // 计算出相差天数
  var leave1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000)) // 计算出小时数
  // 计算相差分钟数
  var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000)) // 计算相差分钟数
  // 计算相差秒数
  // var leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  // var seconds = Math.round(leave3 / 1000)
  var timesString = ''

  if (dayDiff !== 0) {
    timesString = timeStamp(timesData, false, false, true)
  } else if (dayDiff === 0 && hours !== 0) {
    timesString = timeStamp(timesData, false, true)
  } else if (dayDiff === 0 && hours === 0 && minutes !== 0) {
    timesString = minutes + '分钟前'
  } else if (dayDiff === 0 && hours === 0 && minutes === 0) {
    timesString = '刚刚'
  }
  return timesString
}

export function shuffle (arr) {
  let _arr = arr.slice()
  for (let i = 0; i < arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function forArray (array) {
  if (Array.isArray(array)) {
    let other = array.map((d, i) => {
      return d.name
    })
    return other.join(' / ')
  } else {
    return array
  }
}
