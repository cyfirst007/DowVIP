import { test, expect } from '@playwright/test';
import { createWorker } from 'tesseract.js';
const axios = require('axios');
const fs = require('fs');
const loginData = {
  username: 'u393185',
  password: '12481632',
  captcha: '',
};

// 获取验证码图片并保存到本地
/*axios
  .get('http://vipdow.stargym.com.cn/Validate/ValidateCode.ashx', {
    responseType: 'stream',
  })
  .then((response) => {
    response.data.pipe(fs.createWriteStream('captcha.png'));

    // 识别验证码

    (async () => {
      const worker = await createWorker('eng');
      const ret = await worker.recognize('captcha.png');
      console.log(`识别的验证码: ${ret.data.text}`);

      // 构建登录请求数据
      const loginData = {
        username: 'u393185',
        password: '12481632',
        captcha: ret.data.text,
      };

      //运行playwright登录


      await worker.terminate();
    })();
    })
    .catch((error) => {
    console.error('获取验证码图片出错:', error);
    });
*/
    test('test', async ({ page }) => {
      await page.goto('http://vipdow.stargym.com.cn/Login.aspx');
      axios
      .get('http://vipdow.stargym.com.cn/Validate/ValidateCode.ashx', {
        responseType: 'stream',
      })
      .then((response) => {
        response.data.pipe(fs.createWriteStream('captcha.png'));
        
        
      });  
     
      const worker = await createWorker('eng');
      const ret = await worker.recognize('captcha.png');
      console.log(`识别的验证码: ${ret.data.text}`);
      await page.locator('#LoginControl1_txtUserId').click();
      await page.locator('#LoginControl1_txtUserId').fill(loginData.username);
      await page.locator('#LoginControl1_txtUserId').press('Tab');
      await page.locator('#LoginControl1_txtPwd').fill(loginData.password);
      await page.locator('#LoginControl1_txtPwd').press('Tab');
      await page.locator('#LoginControl1_txtCheckCode').fill(ret.data.text);
      await page.getByRole('button', { name: '登录' }).click();
      await page.getByRole('link', { name: '乒乓球预订' }).click();
      await page.getByRole('link', { name: '2023-10-24( Tuesday )' }).click();

    });
    
