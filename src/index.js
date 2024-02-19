const fs = require('fs');
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
          throw new Error('[!] Неверный номер дня');
        }
        console.log(`- Выбранная группа: ${getGroupName(group)} (${group})`);

        // Получение текущей даты, отброс воскресенья
        let currentDate = new Date();
        const day = currentDate.getDay(); 
        const isSunday = (day === 0); 
        if (isSunday) {
          currentDate.setDate(currentDate.getDate() + 1);
        }

        // Query data
        const query = '?group=' + group + '&date=' + currentDate.toISOString().slice(0, 10);
        const url = 'https://arcotel.ru/studentam/raspisanie-i-grafiki/raspisanie-zanyatiy-studentov-ochnoy-i-vecherney-form-obucheniya' + query;
                
        // set user-agent
        const getUserAgents = fs.readFileSync('user-agents.txt', 'utf-8').split('\n');
        const userAgent = getUserAgents[Math.floor(Math.random() * getUserAgents.length)];
        
        const jsonData = await fetchData(url, userAgent, selectedDay);
        for (let i = 0; i < jsonData.length; i++) {
          if (i === 0 && dayIndex === 1) {
            continue; // Пропустить первую пару во вторник
          }

          if (i === jsonData.length - 1) {
            if (jsonData[i].subject === 'Нет пары') {
              continue; // Пропуск вывода пары
            }
          }

          console.log(); // Пустая строка для переноса
          console.log(i + 1 - (dayIndex === 1 ? 1 : 0)); // Нумерация пар с 1 со вторника

          let classroomNumber = jsonData[i].classroom; // Выбирает номер класса из собранной информации
          let classroomType = (classroomNumber && classroomNumber.startsWith('0') ? 'лабораторный корпус' : 'основной корпус');
          
          // Отображение расписания
          if (jsonData[i].subject !== 'Нет пары') {
            if (jsonData[i].subject !== 'Классный час') {
              console.log(`- Предмет: ${jsonData[i].subject}`);
            } else {
              console.log(jsonData[i].subject);
            }
            if (jsonData[i].subject !== 'Классный час') {
              console.log(`- Преподаватель: ${jsonData[i].teacher}`);
              if (classroomType) {
                console.log(`- Аудитория: ${classroomNumber} (${classroomType})`);
              } else {
                console.log(`- Аудитория: неизвестно`);
              }
              console.log(`- Тип: ${jsonData[i].type}`);
            }
          } else {
            console.log(jsonData[i].subject);
          }
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}

function getGroupName(groupId) {
  try {
    const jsonString = fs.readFileSync('groups.json', 'utf-8');
    const groups = JSON.parse(jsonString);
    const group = groups.find((g) => g.groupId === groupId);
    return group ? group.groupName : 'Неизвестная группа';
  } catch (error) {
    console.error(error);
    return 'Неизвестная группа';
  }
}

main();
