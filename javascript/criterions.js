
const findOptimalQuestOrder = (quests, maxLevel = 200) => {
  const { graph, inDegree, levelMap } = buildGraph(quests);
  const order = [];
  const availableQuests = [];

  for (let level = 1; level <= maxLevel; level++) {
    console.log("quest " + level)
    if (levelMap[level]) {
      for (let quest of levelMap[level]) {
        if (inDegree[quest] === 0) {
          availableQuests.push(quest);
        }
      }
    }

    while (availableQuests.length > 0) {
      const currentQuest = availableQuests.shift();
      order.push(currentQuest);

      for (let neighbor of graph[currentQuest]) {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          availableQuests.push(neighbor);
        }
      }
    }
  }
  return order;
}

const buildGraph = (quests) => {
  const graph = {};
  const inDegree = {};
  const levelMap = {};
  const noConditionQuests = [];

  for (let quest of quests) {
    const { id, startCriterion } = quest;
    const questIntId = parseInt(id, 10);
    const { levelReq, questDeps } = parseCriterions(startCriterion);
    
    graph[questIntId] = [];
    inDegree[questIntId] = inDegree[questIntId] || 0;

    if (levelReq === null && questDeps.length === 0) {
      noConditionQuests.push(questIntId);
      continue;
    }

    if (levelReq !== null) {
      levelMap[levelReq] = levelMap[levelReq] || [];
      levelMap[levelReq].push(questIntId);
    }

    for (let dep of questDeps) {
      graph[dep] = graph[dep] || [];
      graph[dep].push(questIntId);
      inDegree[questIntId] = (inDegree[questIntId] || 0) + 1;
    }
  }
  return { graph, inDegree, levelMap, noConditionQuests };
}

const parseCriterions = (startCriterions) => {
  let levelReq = null;
  let questDeps = [];

  const regex = /(\w+)([><]?)(\d+)/g;
  
  let match;
  while ((match = regex.exec(startCriterions)) !== null) {
    const key = match[1];
    const operator = match[2];
    const value = parseInt(match[3], 10);
    
    switch (key) {
      case 'PL':
        levelReq = value;
        break;
      case 'Qf':
        questDeps.push(value);
        break;
    }
  }
  return {
    levelReq,
    questDeps
  }
}

module.exports = {
  findOptimalQuestOrder,
  buildGraph,
  parseCriterions
};