const { Markup } = require('telegraf');

const generateCategories = (categories) =>{
    try{
        return Markup.inlineKeyboard([
            categories.map(c=>{
                return (
                    Markup.button.callback(c.name, c.func)
                )
            })
        ]).resize()
    }
    catch(e){
        console.log(e);
    }
}

const generateAdminCategories = (categories) =>{
    try{
        return Markup.inlineKeyboard([
            categories.map(c=>{
                return (
                    Markup.button.callback(`${c.id}|${c.name}`, c.func)
                )
            })
        ]).resize()
    }
    catch(e){
        console.log(e);
    }
}

const generateAdminFuncKeyboard = () =>{
    try{
        return Markup.inlineKeyboard([
            Markup.button.callback('Админ', 'admin'),
            Markup.button.callback('Пользователь', 'user')
        ]).resize()
    }
    catch(e){
        console.log(e);
    }
}

const generateAdminKeyboard = () =>{
    try{
        return Markup.keyboard([
            ['Добавить категорию ➕', 'Удалить категорию ➖'],
            ['Добавить запись в категорию ➕', 'Удалить запись из категории ➖'],
            ['Категории 📰']
        ]).resize()
    }
    catch(e){
        console.log(e);
    }
}

const generateUserKeyboard = () =>{
    try{
        return Markup.keyboard([
            ['Категории 📰']
        ]).resize()
    }
    catch(e){
        console.log(e);
    }
}

module.exports = {
    generateCategories,
    generateAdminFuncKeyboard,
    generateAdminCategories,
    generateAdminKeyboard,
    generateUserKeyboard
};