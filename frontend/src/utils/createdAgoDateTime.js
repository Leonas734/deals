var moment = require("moment");

function createdAgoDateTime(date) {
  date = new Date(date);
  const days = moment().diff(date, "days");
  const hours = moment().diff(date, "hours");
  const minutes = moment().diff(date, "minutes");

  if (days > 14) {
    const newDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return newDate.toString();
  }

  if (days > 7) {
    return `${days} days ago`;
  }
  if (days > 0) {
    const totalHours = hours - days * 24;
    return `${days} days ${totalHours} hours ago`;
  }
  if (hours < 1) {
    return `${minutes} minutes ago`;
  }
  const totalMinutes = minutes - hours * 60;
  return `${hours} hours ${totalMinutes} mins ago`;
}

export default createdAgoDateTime;
