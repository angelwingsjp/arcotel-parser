import axios from "axios";
import * as cheerio from "cheerio";

const textbeautifier = (text) => {
    return text.replace(/\t/g, '').replace(/\n/g, '');
};

const group = 55397;
console.log("- Selected group: " + group);

const url = "https://arcotel.ru/studentam/raspisanie-i-grafiki/raspisanie-zanyatiy-studentov-ochnoy-i-vecherney-form-obucheniya?group=" + group + "&date=2024-01-15";

const ua = "Mediapartners-Google";
await axios.get(url, {
    headers: {
        'User-Agent': ua,
    }
})
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        const getCurrentWeek = textbeautifier($("div.vt234").find("span").text());
        console.log("[!] Current week: " + getCurrentWeek);

        // Текущий селектор дня; требует переработки
        const selectedDay = 2;

        let dayOfWeek = '';
        switch(selectedDay) {
            case 1:
                dayOfWeek = "понедельник";
                break;
            case 2:
                dayOfWeek = "вторник";
                break;
            case 3:
                dayOfWeek = "среда";
                break;
            case 4:
                dayOfWeek = "четверг";
                break;
            case 5:
                dayOfWeek = "пятница";
                break;
            case 6:
                dayOfWeek = "суббота";
                break;
            default:
                console.error("[!] Invalid selected day");
        }
        console.log(`- Selected day: ${dayOfWeek} (${selectedDay})`);

        let subjectIndex = (selectedDay != 1) ? 1 : 0;

        const i = $(`.vt239.rasp-day.rasp-day${selectedDay}`);
        for (const q of i) {
            const subject = textbeautifier($(q).find(".vt240").text());
            const teacher = textbeautifier($(q).find(".teacher").text());
            const classroom = textbeautifier($(q).find(".vt242").text()).replace("; ", '');
            const type = textbeautifier($(q).find(".vt243").text());

            var data = {
                index: subjectIndex,
                subject: subject,
                teacher: teacher,
                classroom: classroom,
                type: type,
            };

            if (subject.trim() === '') {
                console.log("[!] Empty string found. Skipping");
                continue;
            };
            subjectIndex++;

            const jsonData = [];
            jsonData.push(data);
            const jsonString = JSON.stringify(data, null, 2);
            console.log(jsonString);
        }
    })
    .catch(error => {
        console.error(error);
    });
