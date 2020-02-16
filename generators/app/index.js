const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const ipad = devices['iPad landscape'];

var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    async prompting() {
        this.problem = await this.prompt([
          {
            type: "input",
            name: "url",
            message: "Leetcode problem URL:",
            default: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
          }
        ]);
    }

    writing() {
        const url = this.problem.url;

        puppeteer
        .launch()
        .then(browser => browser.newPage())
        .then(page => {
            return page.emulate(ipad).then(function() {
                return page.goto(url).then(function() {
                    return page.waitFor(200).then(function(){
                        return page.content();
                    });
                  });
            });
        })
        .then(html => {
            const $ = cheerio.load(html);

            const meta = {
                related_topics: [],
                examples: []
            };

            // meta.name = $('[data-cy="question-title"]').text();
            meta.description = $('[data-cy="description-content"]').find('p').first().text();

            var prblm_number_name = $('[data-cy="question-title"]').text();
            var split_number_name = prblm_number_name.split(". ");
            meta.problem_number = split_number_name[0];
            meta.name = split_number_name[1];

            meta.name_slug = meta.name.toLowerCase().replace(new RegExp(' ', 'g'), '_');

           $('[data-cy="description-content"]').find('a').find('span').each(function() {
                meta.related_topics.push( $(this).text());
            });

            $('[data-cy="description-content"]').find('pre').each(function() {
                var split_example = $(this).text().replace(new RegExp('"', 'g'), '`').trim().split('\n')
                meta.examples.push({
                    input: split_example[0].replace("Input: ", ""),
                    output: split_example[1].replace("Output: ", ""),
                    explanation: split_example[2].replace("Explanation: ", "")
                });
            });

            meta.difficulty = $('[data-cy="description-content"]').find('[diff]').text();

            console.log(meta);

            var package_name = meta.problem_number + "." + meta.name_slug.replace(new RegExp('_', 'g'), '-')

            this.fs.copyTpl(
                this.templatePath('readme.md'),
                this.destinationPath(package_name+'/readme.md'),
                meta
            );

            this.fs.copyTpl(
                this.templatePath('main.go'),
                this.destinationPath(package_name+'/main.go'),
                meta
            )

            this.fs.copyTpl(
                this.templatePath('main_test.go'),
                this.destinationPath(package_name+'/main_test.go'),
                meta
            )
        })
        .catch(console.error);
    }


};