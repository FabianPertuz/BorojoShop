db.Clients.find({preferencias:{$elemMatch: {$in: ["natural"]}}})
db.Borojo.find({tags: {$all: ["natural","orgánico"]}})
db.Borojo.find({$expr: {$gt: [{ $size: "$tags" }, 1]  }});