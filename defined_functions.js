db.system.js.updateOne(
  { _id: "calcularDescuento" },
  { 
    $set: {
      value: function(precio, porcentaje) {
        if (precio <= 0 || porcentaje < 0 || porcentaje > 100) return null;
        return precio - (precio * (porcentaje / 100));
      }
    } 
  },
  { upsert: true }
);


db.system.js.updateOne(
  { _id: "clienteActivo" },
  {$set: {
      value: function(idCliente) {
        const count = db.Sales.countDocuments({ clienteId: idCliente });
        return count > 3;}}},
  { upsert: true });



db.system.js.updateOne(
  { _id: "verificarStock" },
  { 
    $set: {
      value: function(productoId, cantidadDeseada) {
        const producto = db.Borojo.findOne({ _id: productoId });
        return producto && producto.stock >= cantidadDeseada;
      }
    } 
  },
  { upsert: true }
);