## arcotel-parser

*[Licensed under the GNU General Public License v3.0](https://github.com/muuneneko/arcotel-parser/blob/main/COPYING)*

## Пояснительная записка
Данный код также совместим с сайтом СПбГУТ (с некоторыми корректировками, соответственно). Код распространяется под лицензией GPLv3.

## Установка зависимостей
`npm install axios cheerio` ¯\\_(ツ)\_/¯

## Подготовка исходников
1. Склонируйте исходный код, используя команду `git clone https://github.com/muuneneko/arcotel-parser/`
2. Найдите ID своей группы, следуя [данной таблице](https://github.com/muuneneko/arcotel-parser/blob/main/docs/groups.md)
3. Подготовьте свои User-agent, вставьте в [user-agents.txt](https://github.com/muuneneko/arcotel-parser/blob/main/user-agents.txt), разделяя их переносом строки
> [!NOTE]
> Вы можете вставить как один user-agent, так и более. Принимаются любые действительные user-agent любого типа и формата.
> При каждом запросе будет использоваться случайно выбранный user-agent из указанного списка.
> Убедитесь, что все user-agent в вашем списке являются действительными, чтобы избежать ошибок при выполнении запросов.
4. А теперь... \*барабанная дробь\* Вы готовы к `node src/index.js`!

## Предварительный показ работы скрипта
![preview.gif](https://github.com/muuneneko/arcotel-parser/blob/main/preview.gif)
