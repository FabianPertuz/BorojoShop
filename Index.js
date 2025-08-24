db.Borojo.createIndex(
  { nombre: 1 },  
  { name: "idx_nombre_productos",
    background: true, 
    collation: {      
      locale: "es",
      strength: 2}
    }
);



db.Borojo.createIndex(
  { categoria: 1, precio: 1 },  
  {
    name: "idx_categoria_precio_productos",
    background: true,
    partialFilterExpression: {precio: { $gt: 0 }}
  }
);



db.Clients.createIndex(
  { email: 1 },
  {name: "idx_email_unique_clientes",
    unique: true,
    background: true,
    collation: {  
      locale: "es", 
      strength: 2
    },
    partialFilterExpression: {  
      email: { $exists: true, $ne: null }}
    }
);


const consulta = db.Borojo.find(
  { nombre: "Borojó fresco" },  
  { nombre: 1, precio: 1, _id: 0 }
);

const explainResult = consulta.explain("executionStats");

print("=== PLAN DE EJECUCIÓN ===");
printjson({
  stage: explainResult.queryPlanner.winningPlan.inputStage.stage,
  indexName: explainResult.queryPlanner.winningPlan.inputStage.indexName,
  documentsExamined: explainResult.executionStats.totalDocsExamined,
  executionTimeMillis: explainResult.executionStats.executionTimeMillis,
  indexBounds: explainResult.queryPlanner.winningPlan.inputStage.indexBounds
});

