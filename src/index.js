const fetchData = require('./helpers/fetchData.js');

async function main() {
  try {
    let group = 55397;
    const url = "https://arcotel.ru/studentam/raspisanie-i-grafiki/raspisanie-zanyatiy-studentov-ochnoy-i-vecherney-form-obucheniya?group=" + group + "&date=2024-01-22";
    const ua = 'Mediapartners-Google';

    const jsonData = await fetchData(url, ua);
    for (let item of jsonData) {
      console.log();
      console.log(item.index);
      console.log(`- Предмет: ${item.subject}`);
      console.log(`- Преподаватель: ${item.teacher}`);
      console.log(`- Аудитория: ${item.classroom}`);
      console.log(`- Тип: ${item.type}`);
    }
  } catch (error) {
    console.error(error);
  }
}

main();
