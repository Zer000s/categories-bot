require('dotenv').config();
const { Telegraf } = require('telegraf');
const fs = require('fs');
const keyboard = require('./keyboards/functionalKeyboard');
const db = require('./function/db/db');
const https = require("https");

const bot = new Telegraf(process.env.TOKEN);

bot.start(async (ctx) => {
    if(ctx.message.from.username){
        if(ctx.chat.username===process.env.ADMIN_NAME){
            return ctx.reply(`Здравствуйте, ${ctx.chat.username}🤚\nУ вас есть права Администратора`, keyboard.generateAdminFuncKeyboard());
        }
        return ctx.reply(`Привет, ${ctx.chat.username}🤚`, keyboard.generateUserKeyboard());
    }
    ctx.reply('У вас не задано имя пользователя');
});

bot.hears(['Добавить категорию ➕', 'Добавить запись в категорию ➕', 'Удалить категорию ➖', 'Удалить запись из категории ➖', 'Категории 📰', /^Удалить\sкатегорию\s(\d+)$/, /^Удалить\sзапись\sиз\sкатегории\s/], async (ctx) => {
    switch(ctx.message.text){
        case 'Добавить категорию ➕':{
            ctx.reply('Отправьте название категории на русском, и на английском (название исполняемой функции) через знак |\nПример: Потанцевать|dance');
            break;
        }
        case 'Добавить запись в категорию ➕':{
            ctx.reply('Отправьте фото с описанием и через знак | укажите id категории\nПример: Описание категории|1');
            break;
        }
        case 'Удалить категорию ➖':{
            ctx.reply('Отправьте сообщение "Удалить категорию (№ категории)"\nПример: Удалить категорию 1');
            break;
        }
        case 'Удалить запись из категории ➖':{
            ctx.reply('Отправьте сообщение "Удалить запись из категории (№ записи)"\nПример: Удалить запись из категории 1');
            break;
        }
        case 'Категории 📰':{
            const categories = await db.getCategories();
            if(ctx.chat.username===process.env.ADMIN_NAME){
                return ctx.reply('Категории 📰', keyboard.generateAdminCategories(categories));
            }
            return ctx.reply('Категории 📰', keyboard.generateCategories(categories));
        }
        default:{
            if(ctx.message.text.split(' ')[1]==='категорию'){
                const id = Number(+/\d+/.exec(ctx.message.text));
                const {dataId} = await db.getIdData(id);
                await db.deleteData(dataId);
                const res = await db.deleteCategories(id);
                if(res.ok){
                    return ctx.reply(`Категория удалена`);
                }
                return ctx.reply(`Категория не удалена\n${res.err}`);
            }
            else if(ctx.message.text.split(' ')[1]==='запись'){
                const id = ctx.message.text.split(' ');
                const res = await db.deleteData(id[4]);
                if(res.ok){
                    return ctx.reply(`Запись удалена`);
                }
                return ctx.reply(`Запись не удалена\n${res.err}`);
            }
        }
    }
})

bot.on('text', async (ctx)=>{
    if(ctx.chat.username===process.env.ADMIN_NAME){
        const message = ctx.message.text.split('|');
        if(message[1]){
            const res = await db.addCategories(message[0], message[1]);
            if(res.ok){
                return ctx.reply(`Категория добавлена`);
            }
            return ctx.reply(`Категория не добавлена\n${res.err}`);
        }
        return ctx.reply('Неправильный формат добавления категории\nПример: Потанцевать|dance');
    }
})

bot.on('photo', async (ctx) => {
    try{
        if(ctx.chat.username===process.env.ADMIN_NAME){
            const caption = ctx.message.caption.split('|');
            const fileId = ctx.message.photo.pop().file_id;
            const {dataId} = await db.getIdData(Number(caption[1]));
            ctx.telegram.getFileLink(fileId).then((link) => {
                https.get(link, (response) =>{
                        response.pipe(fs.createWriteStream(`static/${fileId}.png`));
                    }
                );
            });
            await db.addData(dataId, `static/${fileId}.png`, caption[0]);
        }
    }
    catch(e){
        console.log(e);
    }
})

bot.on('callback_query', async (ctx)=>{
    switch(ctx.callbackQuery.data){
        case 'admin':{
            if(ctx.chat.username===process.env.ADMIN_NAME){
                return ctx.reply('Вы зашли с правами администратора', keyboard.generateAdminKeyboard());
            } 
            break;
        }
        case 'user':{
            if(ctx.chat.username===process.env.ADMIN_NAME){
                return ctx.reply('Вы зашли с правами пользователя', keyboard.generateUserKeyboard());
            }
            break;
        }
        default:{
            const data = await db.getData(ctx.callbackQuery.data);
            if(ctx.chat.username===process.env.ADMIN_NAME){
                return data.map(d=>{
                    return(
                        ctx.replyWithPhoto({source: d.img}, {caption: `${d.id}|${d.text}`})
                    )
                });
            }
            return data.map(d=>{
                return(
                    ctx.replyWithPhoto({source: d.img}, {caption: d.text})
                )
            });
        }
    }
})

bot.launch({dropPendingUpdates: true});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));