import { test, expect } from '@playwright/test';
import { createWorker } from 'tesseract.js';
const tesseract = require('tesseract.js');
const fs = require('fs');
const options = {
  flags: 'a',     // append模式
  encoding: 'utf8',  // utf8编码
};

const log4js = require("log4js");
const util = require("util")
// log4js.configure({
//     appenders: { cheese: { type: "file", filename: "cheese.log" } },
//     categories: { default: { appenders: ["cheese"], level: "error" } },
// });
log4js.configure({
    replaceConsole: true,
    appenders: {
        cheese: {
            // 设置类型为 dateFile
            type: 'dateFile',
            // 配置文件名为 myLog.log
            filename: 'logs/myLog.log',
            // 指定编码格式为 utf-8
            encoding: 'utf-8',
            // 配置 layout，此处使用自定义模式 pattern
            layout: {
                type: "pattern",
                // 配置模式，下面会有介绍
                // pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}'
                pattern: '%d %p %m'
            },
            // 日志文件按日期（天）切割
            pattern: "-yyyy-MM-dd",
            // 回滚旧的日志文件时，保证以 .log 结尾 （只有在 alwaysIncludePattern 为 false 生效）
            keepFileExt: true,
            // 输出的日志文件名是都始终包含 pattern 日期结尾
            alwaysIncludePattern: true,
        },
    },
    categories: {
        // 设置默认的 categories
        default: {appenders: ['cheese'], level: 'debug'},
    }
});


test('vipdow', async ({ page }) => {
        await page.goto('http://vipdow.stargym.com.cn/Login.aspx');
        const logger = log4js.getLogger("cheese");
        await page.waitForTimeout(1000);
        const imageElement = await page.getByTitle('看不清换一张');
        await page.waitForTimeout(1000);
        /*let file = fs.createWriteStream('dailyLog.txt',options);
        let logger = new console.Console(file,file);
        logger.log('脚本开始');*/
        const name = Date.now();
        //获取验证码到本地图片
        await imageElement.screenshot({ path: `captcha.png` });
        //recognizeCaptcha();
        const worker = await createWorker('eng');
        //只识别数字验证码
        await worker.setParameters({
            tessedit_char_whitelist: '0123456789',
          });
        await page.waitForTimeout(500);
        //识别验证码
        const ret = await worker.recognize(`captcha.png`);
        await page.waitForTimeout(1000);
        const test= ret.data.text.trim();
        if (ret.data.text.trim() === '')
        {
          logger.error('验证码为空');
          throw new Error('验证码为空');
        }
        else{
          console.log('验证码为：' + test);
          logger.log('验证码为：' + test);
          worker.terminate();
          await fs.promises.readFile('captcha.png');
          await fs.promises.unlink('captcha.png');
          console.log('图片已删除');
          logger.info('图片已删除');
        }
        //转换识别object到字符
      
        //获取下个工作日
        const nextday = getNextWorkingDay().date.replace(/\b0/g, "");
        const nextday2 = getNextWorkingDay().date
        //获取下个工作日的对应星期数
        const nextweekday = getNextWorkingDay().dayOfWeek;
        const separator1 = "( ";
        const separator2 = " )"
        const twlevehalf = " 12:30:00";
        const combinedNextDayText = `${nextday}${separator1}${nextweekday}${separator2}`;
        console.log(`明天日期周几: ${combinedNextDayText}`);
        const nextdaynoon = `${nextday2}${twlevehalf}`;
        console.log(`明天日期中午12点半: ${nextdaynoon}`);
        console.log(`进入预定页面`);
        logger.info('进入预定页面');
        await page.locator('#LoginControl1_txtUserId').click();
        await page.locator('#LoginControl1_txtUserId').fill('u393185');
        //await page.locator('#LoginControl1_txtUserId').press('Tab');
        await page.locator('#LoginControl1_txtPwd').fill('12481632');
        //await page.locator('#LoginControl1_txtPwd').press('Tab');
        await page.locator('#LoginControl1_txtCheckCode').fill(test);
        console.log(`准备点击登录`);
        logger.info('准备点击登录');
        await page.waitForTimeout(500);
        await page.getByRole('button', { name: '登录' }).click();
        //await page.getByRole('link', { name: '乒乓球预订' }).click();
        //await page.getByRole('link', { name: '2023-10-26( Tuesday )' }).click();
        await page.waitForTimeout(500);
        //导航至乒乓球预定界面
        await page.getByRole('link', { name: '场馆预订' }).click();
        //await page.waitForTimeout(1000);
        await page.getByRole('link', { name: '乒乓球预订' }).click();
        //await page.waitForTimeout(500);
        console.log(`进入乒乓球预定页面`);
        logger.info('进入乒乓球预定页面');
        await page.getByRole('link', { name: combinedNextDayText }).click();
        await page.waitForTimeout(3000);
        console.log(`进入明日乒乓球预定页面`);
        logger.info('进入明日乒乓球预定页面');
        await page.locator('#tgcol7 dl').filter({ hasText: '11:30 – 12:00' }).click();
        await page.waitForTimeout(200);
        await page.getByText('Edit detail »').click();
        console.log(`进入进入时间选择页面`);
        logger.info('进入进入时间选择页面');
        await page.waitForTimeout(200);
        //选择1小时时间
        await page.locator('#select_et').selectOption(nextdaynoon);
        await page.waitForTimeout(200);
        //输入预约用户名
        await page.getByRole('textbox').click();
        await page.waitForTimeout(100);
        await page.getByRole('textbox').fill('u393185,ub00337');
        console.info('用户名输入完毕');
        logger.info('用户名输入完毕');
        await page.waitForTimeout(200);
        //点击确定预定按钮
        await page.getByRole('button', { name: '确定预订' }).click();
        await page.waitForTimeout(200);
        console.info('点击确认预定');
        logger.info('点击确认预定');
        //等待预约结果
        page.once('dialog', dialog => {
          console.log(`预定成功与否 Dialog message: ${dialog.message()}`);
          logger.info(`预定成功与否 Dialog message: ${dialog.message()}`);
          dialog.dismiss().catch(() => {});
        });
        
    });

    function getNextWorkingDay() {
        const today = new Date();
        const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
      
        // 获取明天的日期
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // 格式化日期为 YYYY-MM-DD
        
        //console.log(`明天: ${tomorrow}`);
        // 判断明天是否为周末，如果是，则继续往后推一天，直到找到下一个工作日
        while (tomorrow.getDay() === 0 || tomorrow.getDay() === 6) {
          tomorrow.setTime(tomorrow.getTime() + oneDay);
        }
        //console.log(`明天2: ${tomorrow}`);
        // 格式化日期
        const formattedDate = tomorrow.toISOString().slice(0, 10);
        
        console.log(`明天3: ${formattedDate}`);
      
        // 获取周几的英文表示
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = weekdays[tomorrow.getDay()];
      
        return {
          date: formattedDate,
          dayOfWeek: dayOfWeek
        };
      }

    /*function recognizeCaptcha() {
        // 读取本地图片文件
        fs.readFile('captcha.png', (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          // 使用tesseract.js模块识别图片中的文本
          tesseract.recognize(data, 'eng', {tessedit_char_whitelist: '0123456789'})
            .then(result => {
              // 获取识别结果
              let text = result.text.trim();
              // 如果识别结果为空，重新识别
              if (text === '') {
                console.log('验证码为空，重新识别');
                recognizeCaptcha();
              } else {
                // 如果识别结果不为空，打印结果并结束程序
                console.log('验证码为：' + text);
                validationcode = result.text;
                process.exit(0);
              }
            })
            .catch(error => {
              console.error(error);
            });
        });
      }*/