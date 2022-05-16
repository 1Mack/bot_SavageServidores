function twoDigits(n) {
  return n.toString().padStart(2, '0');
}

exports.currentDateFormatted = (date = new Date()) => {
  const day = twoDigits(date.getDate());
  const month = twoDigits(date.getMonth() + 1);
  const year = date.getFullYear();

  const hour = twoDigits(date.getHours());
  const minutes = twoDigits(date.getMinutes());
  const seconds = twoDigits(date.getSeconds());

  return `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;
}

