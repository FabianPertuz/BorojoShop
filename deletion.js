db.clientes.deleteOne({email: "juan@email.com" })
db.productos.deleteMany({$or: [{ stock: { $lt: 5}},{ stock: { $exists: false } }]});