db.Sales.aggregate([
  {$unwind: "$productos"},
  {$group: {
      _id: "$productos.productoId",  
      totalUnidadesVendidas: { $sum: "$productos.cantidad" }, 
      totalVentas: { $sum: 1 } 
    }},
  {$sort: { totalUnidadesVendidas: -1 }},
  {$lookup: {
      from: "Borojo",
      localField: "_id",
      foreignField: "_id",
      as: "infoProducto"
    }},
  {$project: {
      productoId: "$_id",
      totalUnidadesVendidas: 1,
      totalVentas: 1,
      nombreProducto: { $arrayElemAt: ["$infoProducto.nombre", 0] },
      _id: 0}
    }]);


