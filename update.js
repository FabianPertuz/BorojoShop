db.Borojo.updateOne({nombre:"Borojó deshidratado"},{$inc:{stock:10}})
db.Borojo.updateOne({categoria:"Bebida"},{$push:{tags:"bajo azúcar"}})