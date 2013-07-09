/* A module that has functions to serialize arrays of data into PROV-N, PROV-O or PROV-XML */


/* Serialize the specified entries in the specified serialization (default: PROV-N) */
function serialize(serialization, prefixes, repository, entities, activities, agents, specializations, derivations, starts, ends, attributions, associations, callback){
  switch(serialization) {
    case "PROV-JSON":
      serializePROVJSON(prefixes, repository, entities, activities, agents, specializations, derivations, starts, ends, attributions, associations, callback);
      break;
    case "PROV-O":
      serializePROVO(prefixes, repository, entities, activities, agents, specializations, derivations, starts, ends, attributions, associations, callback);
      break;
    case "PROV-XML":
      serializePROVXML(prefixes, repository, entities, activities, agents, specializations, derivations, starts, ends, attributions, associations, callback);
      break;
    default:
      serializePROVN(prefixes, repository, entities, activities, agents, specializations, derivations, starts, ends, attributions, associations, callback);
  }
}

/* Serialize the specified entries as a PROV-JSON object */
function serializePROVJSON(prefixes, repository, entities, activities, agents, specializations, derivations, starts, ends, attributions, associations, callback){
  var bundlename = "repository:" + repository;
  var provObject = {};
  provObject["prefix"] = prefixes;
  provObject["bundle"] = {};
  provObject["bundle"][bundlename] = {};
  if(entities) {
    provObject["bundle"][bundlename]["entity"] = entities;
  }
  if(activities) {
    provObject["bundle"][bundlename]["activity"] = activities;
  }
  if(agents) {
    provObject["bundle"][bundlename]["agent"] = agents;
  }
  if(specializations) {
    provObject["bundle"][bundlename]["specializationOf"] = specializations;
  }
  if(derivations) {
    provObject["bundle"][bundlename]["wasDerivedFrom"] = derivations;
  }
  if(starts) {
    provObject["bundle"][bundlename]["wasStartedBy"] = starts;
  }
  if(ends) {
    provObject["bundle"][bundlename]["wasEndedBy"] = ends;
  }
  if(attributions) {
    provObject["bundle"][bundlename]["wasAttributedTo"] = attributions;
  }
  if(associations) {
    provObject["bundle"][bundlename]["wasAssociatedWith"] = associations;
  }
  callback(JSON.stringify(provObject, undefined, 2),"text/plain");//TODO: change to text/json
}

/* Serialize the specified PROV-JSON object in PROV-N */
function serializePROVN(prefixes, repository, entities, activities, agents, specializations, derivations, starts, ends, attributions, associations, callback){
  //write everything to the result string
  var prov = "document" + "\n";
  for (var prefix in prefixes) {
    if (prefixes.hasOwnProperty(prefix)) {
      prov += "prefix " + prefix + " <" + prefixes[prefix] + ">" + "\n";
    }
  }
  prov += "bundle repository:" + repository + "\n";
  for (var entity in entities) {
    if (entities.hasOwnProperty(entity)) {
      prov += "entity(" + entity + (entities[entity]["prov:label"]?", [prov:label=\""+entities[entity]["prov:label"]+"\"]":"") + ")" + "\n";
    }
  }
  for (var activity in activities) {
    if (activities.hasOwnProperty(activity)) {
      prov += "activity(" + activity + (activities[activity]["prov:label"]?", [prov:label=\""+activities[activity]["prov:label"]+"\"]":"") + ")" + "\n";
    }
  }
  for (var agent in agents) {
    if (agents.hasOwnProperty(agent)) {
      prov += "agent(" + agent + (agents[agent]["prov:label"]?", [prov:label=\""+agents[agent]["prov:label"]+"\"]":"") + ")" + "\n";
    }
  }
  for (var specialization in specializations) {
    if (specializations.hasOwnProperty(specialization)) {
      prov += "specializationOf(" + specializations[specialization]["prov:specificEntity"] + "," + specializations[specialization]["prov:generalEntity"] + ")" + "\n";
    }
  }
  for (var derivation in derivations) {
    if (derivations.hasOwnProperty(derivation)) {
      prov += "wasDerivedFrom(" + derivations[derivation]["prov:generatedEntity"] + "," + derivations[derivation]["prov:usedEntity"] + ")" + "\n";
    }
  }
  for (var start in starts) {
    if (starts.hasOwnProperty(start)) {
      prov += "wasStartedBy(" + starts[start]["prov:activity"] + ", -, -, " + starts[start]["prov:time"] + ")" + "\n";
    }
  }
  for (var end in ends) {
    if (ends.hasOwnProperty(end)) {
      prov += "wasStartedBy(" + ends[end]["prov:activity"] + ", -, -, " + ends[end]["prov:time"] + ")" + "\n";
    }
  }
  for (var attribution in attributions) {
    if (attributions.hasOwnProperty(attribution)) {
      prov += "wasAttributedTo(" + attributions[attribution]["prov:entity"] + ", " + attributions[attribution]["prov:agent"] + ", [prov:type=\"" + attributions[attribution]["prov:type"] + "\"])" + "\n";
    }
  }
  for (var association in associations) {
    if (associations.hasOwnProperty(association)) {
      prov += "wasAssociatedWith(" + associations[association]["prov:activity"] + ", " + associations[association]["prov:agent"] + ", [prov:role=\"" + associations[association]["prov:role"] + "\"])" + "\n";
    }
  }
  prov += "endBundle " + "\n";
  prov += "endDocument" + "\n";
  callback(prov,"text/plain");//TODO: change to text/prov-notation
}

/* Serialize the specified PROV-JSON object in PROV-O */
function serializePROVO(prefixes, repository, entities, activities, agents, specializations, derivations, starts, ends, attributions, associations, callback){
  callback("serialization unsupported","text/plain");//TODO: change to RDF
}

/* Serialize the specified PROV-JSON object in PROV-XML */
function serializePROVXML(prefixes, repository, entities, activities, agents, specializations, derivations, starts, ends, attributions, associations, callback){
  callback("serialization unsupported","text/plain");//TODO: change to text/X
}

exports.serialize = serialize;