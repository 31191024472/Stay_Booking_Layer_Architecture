import { parse, format } from 'date-fns';

/**
 * Định dạng một đối tượng Date của JavaScript thành chuỗi có định dạng "DD/MM/YYYY".
 *
 * @param date - Đối tượng Date cần định dạng.
 * @returns Một chuỗi biểu diễn ngày đã được định dạng.
 * @example formatDate(new Date('2022-01-01')) // "01/01/2022"
 */

function formatDate(date) {
  // Kiểm tra nếu date không được truyền vào hoặc không phải là một đối tượng Date hợp lệ
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return;
  }
  let day = date.getDate().toString();
  let month = (date.getMonth() + 1).toString();
  let year = date.getFullYear().toString();

  day = day.length < 2 ? `0${day}` : day;
  month = month.length < 2 ? `0${month}` : month;
  return `${day}/${month}/${year}`;
}

/**
 * Định dạng một chuỗi ngày có định dạng "DD-MM-YYYY" thành định dạng dễ đọc hơn.
 *
 * @param dateString - Chuỗi ngày cần định dạng.
 * @returns Một chuỗi biểu diễn ngày đã được định dạng.
 * @example getReadableMonthFormat('01-01-2022') // "1 January 2022"
 */

function getReadableMonthFormat(dateString) {
  if (!dateString) {
    return '';
  }
  return format(parse(dateString, 'dd-MM-yyyy', new Date()), 'd MMMM yyyy');
}

export { formatDate, getReadableMonthFormat };