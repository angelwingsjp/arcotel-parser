import axios from "axios";
import * as cheerio from "cheerio";

const textbeautifier = (text) => {
    return text.replace(/\t/g, '').replace(/\n/g, '');
};

const group = 55397;
console.log("- selected group: " + group);
const url = "https://arcotel.ru/studentam/raspisanie-i-grafiki/raspisanie-zanyatiy-studentov-ochnoy-i-vecherney-form-obucheniya?group=" + group;

const ua = "Mediapartners-Google";
const response = await axios.get(url, {
    headers: {
        'User-Agent': ua,
    }
});
const html = response.data;
const $ = cheerio.load(html);

const selectedDay = 5;
console.log("- selected day: " + selectedDay);

const i = $(`.vt239.rasp-day.rasp-day${selectedDay}`);
for (const q of i) {
    const data = {
        subject: textbeautifier($(q).find(".vt240").text()),
        teacher: textbeautifier($(q).find(".teacher").text()),
        classroom: textbeautifier($(q).find(".vt242").text()).replace("; ", ''),
        type: textbeautifier($(q).find(".vt243").text()),
    };
    const text = $(q).text().trim();
    console.log(data);
}
