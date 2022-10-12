import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer-extra';
import UserAgent from 'user-agents';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';

const app = express();
app.use(express.json());
app.use(cors());


const PORT = 4000

//setting up server
app.listen(PORT, () => {
    console.log('Server running on', PORT);
})


puppeteer.use(StealthPlugin());
puppeteer.use(RecaptchaPlugin());


app.post('/login', async (req, res) => {

   
     (async (data) => {
  
     
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setUserAgent(UserAgent.random().toString())
    await page.goto('https://www.linkedin.com');

    //creating email and password variables   
    const emailValue = data.email;
    const passwordValue = data.password;
    
    //changing input values & logging in
    setTimeout( async() => {
        await page.evaluate((val) => document.querySelector(".input input").value=val, emailValue);

        setTimeout(async () => {
            await page.evaluate((val) => document.querySelector(".input #session_password").value=val,passwordValue);

            setTimeout( async () => {
                await page.evaluate((val) => document.querySelector(".sign-in-form__submit-button").click());
            },2000)

        },2000);

    },2000)









    //navigating to connections page
    await page.waitForNavigation({waitUntil: 'domcontentloaded'});

    await page.evaluate((val) => {
    let arr = [];

    const navButtons = document.getElementsByClassName("app-aware-link global-nav__primary-link");

    Array.from(navButtons).forEach((button) => {
        arr.push(button);
    })

    setTimeout(() => {
        arr[1].click();
    },2000)

    });


    //going to connections page
    await page.waitForNavigation({waitUntil: 'domcontentloaded'});

    //putting the url directly in browser
    setTimeout( async () => {
        await page.goto("https://www.linkedin.com/mynetwork/invite-connect/connections/", {waitUntil:'domcontentloaded'});
    },4000);

    
    await page.waitForSelector(".mn-connection-card.artdeco-list");

    const connectionsList = await page.evaluate( async () => {
       let connectionArr = [];
       let list = await document.getElementsByClassName("mn-connection-card artdeco-list");
       
       Array.from(list).forEach((elm) => {
        connectionArr.push(elm.innerText);
       })
       
       let resp = connectionArr.slice(0,5);
    
       return resp;
       
       
    });


    res.status(200).send({result: connectionsList});


    //tried to click the connection button
    // await page.evaluate((val) => {

    //     let arr=[];

    //     const buttons = document.getElementsByClassName("ember-view mn-community-summary__link link-without-hover-state");

    //     Array.from(buttons).forEach((button) => {
    //         arr.push(button);
    //     })
        
    //     setTimeout(() => {
    //         arr[0].click();
    //     },2000)
        
 
    // });

    // console.log(connectionButtons.length);




    await browser.close();

    })(req.body)
    
}) 


// href ember-view mn-community-summary__link link-without-hover-state
// .dsa account dummy pass - dummyaccount123
              
