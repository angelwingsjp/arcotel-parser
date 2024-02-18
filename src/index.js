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

        // Отображение выбранного дня и номера группы
        const dayNames = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
        const dayIndex = parseInt(selectedDay) - 1;
        if (dayIndex >= 0 && dayIndex <= 5) {
          const dayName = dayNames[dayIndex];
          console.log(`- Выбранный день: ${dayIndex + 1} (${dayName})`);
        } else {
          throw new Error("[!] Неверный номер дня");
        }
        console.log(`- Номер группы: ${group}`);

        // Получение текущей даты, отброс воскресенья
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
        if (jsonData.length === 0) {
          console.log('Отсутствуют пары');
        } else {
          for (let item of jsonData) {
            console.log();
            console.log(item.index);
            if (item.subject !== 'Нет пары') {
              console.log('- Предмет: ' + item.subject);
              console.log('- Преподаватель: ' + item.teacher);
              console.log('- Аудитория: ' + item.classroom);
              console.log('- Тип: ' + item.type);
            } else {
              console.log(item.subject);
            }
          }
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}

main();
