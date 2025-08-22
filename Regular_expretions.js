db.Borojo.find({nombre: /^Boro/i });
db.Borojo.find({nombre: { $regex: /con/i }});
db.Clientes.find({ nombre: { $regex: /z/i }});