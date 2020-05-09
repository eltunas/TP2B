const mongoClient = require('mongodb').MongoClient;
const uriDatabase = 'mongodb+srv://Admin:name.admin@cluster0-f153b.gcp.mongodb.net/test?retryWrites=true&w=majority';//"mongodb+srv://admin:betp2@cluster0-3bm3a.azure.mongodb.net/test?retryWrites=true&w=majority";


const client = new mongoClient(uriDatabase, { useNewUrlParser: true, useUnifiedTopology: true });

CRUD();


async function CRUD(){

    const newInventor = {
        first : "Erwin",
        last : "Schrodinger",
        year : 1900
    }

    const updatedInventor = {
        first : "Emmet",
        last : "Brown",
        year : 3000
    }


    console.log('conectando...');
    const collectionInventors = await getCollectionProm();

    console.log('Buscando inventors');
    let inventors = await getInventorsProm(collectionInventors);

    console.log('Agregando el inventor ' + newInventor.last);
    let addedInventor = await addInventorProm(collectionInventors, newInventor);

    console.log('buscando inventor ' + newInventor.last);
    let fetchedInventor = await getInventorProm(collectionInventors, newInventor.last);

    console.log('Modificando el inventor ' + newInventor.last + " a " + updatedInventor.last);
    updateInventorProm(collectionInventors, newInventor.last, updatedInventor); 

    console.log('buscando inventor ' + updatedInventor.last);
    fetchedInventor = await getInventorProm(collectionInventors, updatedInventor.last);

    console.log('borrando inventor '+ updatedInventor.last);
    await deleteInventorsProm(collectionInventors, updatedInventor.last);

    console.log('Buscando inventors');
    inventors = await getInventorsProm(collectionInventors);

    closeClient();
}

    
function getCollectionProm(){
    
    return client.connect()
    .then((result) => {
        console.log('conecto');
        return result.db('sample_betp2').collection('inventors');
    })
    .catch((error) => {
        console.log(error);            
    });
    
}

function closeClient(){    
    client.close(() => {
        console.log('Gracias por elegir mongoDB');
    });
}


async function getInventorsProm(collection) {
    
    return collection.find().toArray()
        .then((result) => {
            console.log("estos son los inventores");
            console.log(result)
            return result;
        })
        .catch((error) => {
            console.log(error);
        });
}


async function getInventorProm(collectionInventors, apellido) {

    return collectionInventors.findOne({ last: apellido })
        .then((result) => {
            console.log("estos son los datos del inventor " + apellido);
            console.log(result)
            return result;
        })
        .catch((error) => {
            console.log(error);
        }); 
 
}

async function addInventorProm(collection, inventor) {

    return collection.insertOne(inventor)
    .then((result) => {
        console.log('Se agrego el inventor ' + inventor.last);
        return result;
    })
    .catch((error) => {
        console.log(error);
    }); 
    
}

async function updateInventorProm(collection, appelido, inventor) {

    return collection.updateOne(
        {last: appelido},
        { $set: {
            first: inventor.first,
            last: inventor.last,
            year: inventor.year
            }
        },
        { upsert: true }
    )
    .then((result) => {
        console.log('Se modifico el inventor ' + inventor.last);
        return result;        
    })
    .catch((error) => {
        console.log(error);
    }); 
 
}


async function deleteInventorsProm(collection, appelido) {
 
        return collection.deleteOne({last: appelido})
        .then((result) => {
            console.log('se borro el inventor');
            return result;
        })
        .catch((error) => {
            console.log(error);
        }); 
 
}