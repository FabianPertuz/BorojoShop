db.Sales.aggregate([
  {$unwind: "$productos"},
  {$group: {
      _id: "$productos.productoId",  
      totalUnidadesVendidas: { $sum: "$productos.cantidad" }, 
      totalVentas: { $sum: 1 }}},
  {$sort: { totalUnidadesVendidas: -1 }},
  {$lookup: {
      from: "Borojo",
      localField: "_id",
      foreignField: "_id",
      as: "infoProducto"}},
  {$project: {
      productoId: "$_id",
      totalUnidadesVendidas: 1,
      totalVentas: 1,
      nombreProducto: { $arrayElemAt: ["$infoProducto.nombre", 0] },
      _id: 0}
    }]);


db.Sales.aggregate([
  {$unwind: "$productos"},
  {$group: {
      _id: "$clienteId",
      totalProductos: { $sum: "$productos.cantidad" }}},
  {$group: {
      _id: "$totalProductos",
      clientes: {
        $push: {
          clienteId: "$_id",
          totalProductos: "$totalProductos"}}}},
  {$sort: { _id: 1 } }]);


  db.Sales.aggregate([
  {$group: {_id: {
        $month: "$fecha"},
      totalVentas: { $sum: 1 },        
      montoTotal: { $sum: "$total" }}},
  {$sort: { _id: 1 }  },
  {$project: {
      mes: "$_id",
      totalVentas: 1,
      montoTotal: 1,
      _id: 0}}]);


db.Sales.aggregate([
  {
    $group: {
      _id: { },
      promedioVenta: { $avg: "$total" }, 
      montoMinimo: { $min: "$total" },    
      montoMaximo: { $max: "$total" }    
}},
  {$sort: { _id: 1 }},
  {$project: {

      promedioVenta: { $round: ["$promedioVenta", 2] },
      montoMinimo: 1,
      montoMaximo: 1,
      _id: 0}}])



 db.Borojo.aggregate([
  {$group: {
      _id: "$categoria",  
      promedioPrecio: { $avg: "$precio" },
      cantidadProductos: { $sum: 1 },}},
  {$sort: { promedioPrecio: 1 } },
  {$project: {
      categoria: "$_id",
      promedioPrecio: { $round: ["$promedioPrecio", 2] },  
      cantidadProductos: 1,
      _id: 0}}])



db.productos.aggregate([
  {$sort: { stock: -1 } },
  {$limit: 3  
  },
  {$project: {
      nombre: 1,
      stock: 1,
      categoria: 1,
      precio: 1,
      _id: 0}}]);