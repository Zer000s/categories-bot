const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const uuid = require('uuid');

const getCategories = async () =>{
    try{
        const db = await open({
            filename: './db.sqlite',
            driver: sqlite3.cached.Database
        });
        const result = await db.all('SELECT * FROM categories');
        return result;
    }
    catch(e){
        console.log(e);
    }
}

const addCategories = async (name, func) =>{
    try{
        const db = await open({
            filename: './db.sqlite',
            driver: sqlite3.cached.Database
        });
        const id = await uuid.v4();
        const data = await db.run(`INSERT INTO categories(name, func, dataId) VALUES('${name}', '${func}', '${id}')`);
        return {ok:true, data: data};
    }
    catch(e){
        return {ok:true, err: e};
    }
}

const deleteCategories = async (id) =>{
    try{
        const db = await open({
            filename: './db.sqlite',
            driver: sqlite3.cached.Database
        });
        const data = await db.run(`DELETE FROM categories WHERE id = ${id};`);
        return {ok:true, data: data};
    }
    catch(e){
        return {ok:true, err: e};
    }
}

const getData = async (categories) =>{
    try{
        const db = await open({
            filename: './db.sqlite',
            driver: sqlite3.cached.Database
        });
        const {id} = await db.get(`SELECT dataId AS id FROM categories WHERE func = '${categories}'`);
        return await db.all(`SELECT * FROM dataCategories WHERE id = '${id}'`);
    }
    catch(e){
        console.log(e);
    }
}

const addData = async (id, img, text) =>{
    try{
        const db = await open({
            filename: './db.sqlite',
            driver: sqlite3.cached.Database
        });
        const data = await db.run(`INSERT INTO dataCategories VALUES('${id}', '${img}', '${text}')`);
        return {ok:true, data: data};
    }
    catch(e){
        console.log(e);
    }
}

const deleteData = async (id) =>{
    try{
        const db = await open({
            filename: './db.sqlite',
            driver: sqlite3.cached.Database
        });
        const data = await db.run(`DELETE FROM dataCategories WHERE id = '${id}';`);
        return {ok:true, data: data};
    }
    catch(e){
        console.log(e);
    }
}

const getIdData = async (id) =>{
    try{
        const db = await open({
            filename: './db.sqlite',
            driver: sqlite3.cached.Database
        });
        const result = await db.get(`SELECT dataId FROM categories where id = ${id}`);
        return result;
    }
    catch(e){
        console.log(e);
    }
}

module.exports = {
    getCategories,
    addCategories,
    deleteCategories,
    getData,
    addData,
    deleteData,
    getIdData
};