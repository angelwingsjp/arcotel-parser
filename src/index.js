const readline = require('readline');
const fetchData = require('./helpers/fetchData.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  try {
    rl.question('Введите номер группы: ', async (group) => {
      rl.question('Введите номер выбранного дня: ', async (selectedDay) => {
        rl.close();
        console.log('Номер группы: ' + group);
        console.log('Номер выбранного дня: ' + selectedDay);

        let currentDate = new Date();
        const day = currentDate.getDay(); 
        const isSunday = (day === 0); 

        if (isSunday) {
          currentDate.setDate(currentDate.getDate() + 1);
        }

        const query = "?group=" + group + "&date=" + currentDate.toISOString().slice(0, 10);
        const url = "https://arcotel.ru/studentam/raspisanie-i-grafiki/raspisanie-zanyatiy-studentov-ochnoy-i-vecherney-form-obucheniya" + query;
        const ua = 'Mediapartners-Google';
        
        const jsonData = await fetchData(url, ua, selectedDay);
        for (let item of jsonData) {
          console.log();
          console.log(item.index);
          console.log('- Предмет: ' + item.subject);
          console.log('- Преподаватель: ' + item.teacher);
          console.log('- Аудитория: ' + item.classroom);
          console.log('- Тип: ' + item.type);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}

main();
