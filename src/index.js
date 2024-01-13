import axios from "axios";
import * as cheerio from "cheerio";

const textbeautifier = (text) => {
    return text.replace(/\t/g, '').replace(/\n/g, '');
};

const group = 55397;
console.log("- Selected group: " + group);

const url = "https://arcotel.ru/studentam/raspisanie-i-grafiki/raspisanie-zanyatiy-studentov-ochnoy-i-vecherney-form-obucheniya?group=" + group + "&date=2024-01-15";

const ua = "Mediapartners-Google";
const response = await axios.get(url, {
    headers: {
        'User-Agent': ua,
    }
});
const html = response.data;
const $ = cheerio.load(html);

const selectedDay = 1;
console.log("- Selected day: " + selectedDay);

let subjectIndex = (selectedDay != 1) ? 1 : 0;

const i = $(`.vt239.rasp-day.rasp-day${selectedDay}`);
for (const q of i) {
    const subject = textbeautifier($(q).find(".vt240").text());
    const teacher = textbeautifier($(q).find(".teacher").text());
    const classroom = textbeautifier($(q).find(".vt242").text()).replace("; ", '');
    const type = textbeautifier($(q).find(".vt243").text());

    const data = {
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
    console.log(data);
}
