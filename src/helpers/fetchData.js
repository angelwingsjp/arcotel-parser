const axios = require('axios');
const cheerio = require('cheerio');
const UserAgent = require('user-agents');

// Константа, удаляющая мусорную табуляцию и перенос строк
const textbeautifier = (text) => {
  return text.replace(/\t|\n/g, '');
};

/**
 * Получение данных с указанного URL 
 *
 * @param {string} url - URL-адрес, с которого нужно получить данные
 * @param {number} selectedDay - Выбранный день для сбора данных
 */
async function fetchData(url, selectedDay) {
  try {
    const userAgent = new UserAgent().toString();
    const response = await axios.get(url, {
      headers: {
        'User-Agent': userAgent,
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const getCurrentWeek = textbeautifier($('div.vt234').find('span').text());
    console.log(`- Текущая неделя: ${getCurrentWeek}`);

    let subjectIndex = (selectedDay != 1) ? 1 : 0;
    const i = $(`.vt239.rasp-day.rasp-day${selectedDay}`);

    let jsonData = [];
    for (const q of i) {
      const subject = textbeautifier($(q).find('.vt240').text());
      const teacher = textbeautifier($(q).find('.teacher').text());
      const classroom = textbeautifier($(q).find('.vt242').text()).replace(/[^0-9]/g, '');
      const type = textbeautifier($(q).find('.vt243').text());

      var data = {
        index: subjectIndex,
      };

      if (subject.trim() === '') {
        data.subject = 'Нет пары';
      } else {
        data.subject = subject;
        data.teacher = teacher;
        data.classroom = classroom;
        data.type = type;
      }
      subjectIndex++;

      jsonData.push(data);
    }

    return jsonData;
  } catch (error) {
    console.error(error);
  }
}

module.exports = fetchData;
