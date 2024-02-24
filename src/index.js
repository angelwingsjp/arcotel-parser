const fs = require('fs');
const readline = require('readline');

const fetchData = require('./helpers/fetchData.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const jsonString = fs.readFileSync('groups.json', 'utf-8');
const groups = JSON.parse(jsonString);

async function main() {
  try {
    rl.question('Введите номер группы: ', async (groupInput) => {
      const group = getGroupId(groupInput);

      // Проверяем, удалось ли получить ID группы
      if (!group) {
        throw new Error('[!] Неправильный формат ввода номера группы');
      }

      // Проверяем существование группы в файле groups.json
      const groupExists = groups.some((g) => g.groupId === group);
      if (!groupExists) {
        throw new Error('[!] Группы с таким номером не существует');
      }

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

        const jsonData = await fetchData(url, selectedDay);
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

function getGroupId(groupInput) {
  const input = groupInput.toUpperCase();
  const groupNameRegex = /^[А-ЯA-Z]{1,4}[ \-+_]\d{2}$/;

  if (!isNaN(input)) {
    return input;
  }

  if (typeof input === 'string' && groupNameRegex.test(input)) {
    const cleanedInput = input.replace(/[ \-+_]/g, '-');

    const jsonString = fs.readFileSync('groups.json', 'utf-8');
    const groups = JSON.parse(jsonString);
    const group = groups.find((g) => g.groupName.toUpperCase() === cleanedInput);
    if (group) {
      return group.groupId;
    }
  }

  return null;
}

function getGroupName(groupInput) {
  try {
    const jsonString = fs.readFileSync('groups.json', 'utf-8');
    const groups = JSON.parse(jsonString);
    const group = groups.find((g) => g.groupId === groupInput || g.groupName === groupInput);
    return group ? group.groupName : 'Неизвестная группа';
  } catch (error) {
    console.error(error);
    return 'Неизвестная группа';
  }
}

main().catch(console.error);
