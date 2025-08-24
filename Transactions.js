const session = db.getMongo().startSession();
const dbSession = session.getDatabase("Drink_Shop");
session.startTransaction();

try {
  dbSession.Borojo.updateOne({ _id: 1 }, { $inc: { stock: -1 } });
  dbSession.Sales.insertOne({ producto_id: 1, cantidad: 1, fecha: new Date() });
  session.commitTransaction();
  print("Venta registrada correctamente");} catch (e) {session.abortTransaction();print("Error:", e);} finally {session.endSession();}print("Fin del script")



function entradaInventario(productoId, cantidad, proveedor, lote, fechaCaducidad, costoUnitario) {
  const session = db.getMongo().startSession();
  
  try {session.startTransaction({
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" }
    });
    
    const producto = db.Borojo.findOne(
      { _id: productoId },
      { session, projection: { nombre: 1, stock: 1 } }
    );
    
    if (!producto) {
      throw new Error(`Producto ${productoId} no encontrado`);
    }
    
    const documentoInventario = {
      productoId: productoId,
        lote: lote || "N/A",
      cantidad: cantidad,
      entrada: new Date(),  
    };
    
    const resultadoInventario = db.Inventory.insertOne(documentoInventario, { session });
    
    const resultadoStock = db.productos.updateOne(
      { _id: productoId },
      { 
        $inc: { stock: cantidad },
        $set: { 
          ultimaActualizacion: new Date(),
          proveedor: proveedor 
        }
      },
      { session }
    );
    
    if (resultadoStock.modifiedCount === 0) {
      throw new Error("No se pudo actualizar el stock del producto");
    } 
    session.commitTransaction();
    session.endSession();
    return {
      success: true,
      inventarioId: resultadoInventario.insertedId,
      producto: producto.nombre,
      cantidadAgregada: cantidad,
      stockNuevo: producto.stock + cantidad,
      mensaje: "Entrada de inventario registrada exitosamente"};} catch (error) {
    if (session.inTransaction()) {session.abortTransaction();}session.endSession();
    return {
      success: false,
      error: error.message,
      mensaje: "Entrada de inventario fallida"};}}


function procesarDevolucion(ventaId, motivoDevolucion) {
  const session = db.getMongo().startSession();
  
  try {
    session.startTransaction({
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" }
    });
    

    const venta = db.Sales.findOne(
      { _id: ventaId },
      { session }
    );
    
    if (!venta) {
      throw new Error(`Venta ${ventaId} no encontrada`);
    }
    
    if (venta.estado === "devuelta") {
      throw new Error("Esta venta ya fue devuelta anteriormente");
    }
    
    for (const producto of venta.productos) {
      const resultadoStock = db.Borojo.updateOne(
        { _id: producto.productoId },
        { 
          $inc: { stock: producto.cantidad },
          $set: { ultimaActualizacion: new Date() }
        },
        { session }
      );
      
      if (resultadoStock.modifiedCount === 0) {
        throw new Error(`No se pudo actualizar stock del producto ${producto.productoId}`);
      }
    }
    
    const documentoDevolucion = {
      ventaId: ventaId,
      clienteId: venta.clienteId,
      fechaDevolucion: new Date(),
      productos: venta.productos,
      totalDevolucion: venta.total,
      motivo: motivoDevolucion || "Devolución general",
      estado: "completada",
      timestamp: new Date()
    };
    
    const resultadoDevolucion = db.devoluciones.insertOne(documentoDevolucion, { session });
    
    const resultadoVenta = db.Sales.updateOne(
      { _id: ventaId },
      { 
        $set: { 
          estado: "devuelta",
          fechaDevolucion: new Date(),
          motivoDevolucion: motivoDevolucion
        } 
      },
      { session }
    );
    
    if (resultadoVenta.modifiedCount === 0) {
      throw new Error("No se pudo marcar la venta como devuelta");
    }
    
    session.commitTransaction();
    session.endSession();
    
    return {
      success: true,
      devolucionId: resultadoDevolucion.insertedId,
      ventaId: ventaId,
      totalDevolucion: venta.total,
      productosDevueltos: venta.productos.length,
      mensaje: "Devolución procesada exitosamente"
    };
    
  } catch (error) {
    if (session.inTransaction()) {
      session.abortTransaction();
    }
    session.endSession();
    
    return {
      success: false,
      error: error.message,
      mensaje: "Devolución fallida"
    };
  }
}