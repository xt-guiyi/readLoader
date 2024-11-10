export function getCurrentDateFormatted() {
    // 获取当前时间
    const currentDate = new Date();

    // 提取年、月、日
    const year = currentDate.getFullYear();
    // 月份需要加 1，因为 JavaScript 中月份从 0 开始计数
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    // 格式化为 'yyyy.mm.dd' 的形式
    const formattedDate = `${year}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`;

    return formattedDate;
}
