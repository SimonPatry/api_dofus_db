# Quest Dependency Mapper

Le projet est basé sur l'api dofusDB, on recupère les quêtes via l'api et on parse les datas dedans

## Datas - format
La fonction buildGraph crée des objets pour mapper de différentes manières les quêtes:
  * graph: {"questId" = ["mustBeFinishedQuestId", "mustBeFinishedQuestId"]}
  * inDegree: quests depth meaning number of quests needed before being able tot take it
  * levelMap: {"level": ["accessibleQuestId", "accessibleQuestId"]}
  * noConditionQuests: struct identical to graph - quests that don't seem to have any requirement

CAUTION: conditions check is incomplete (05/09/2024)

## Installation
1. Clone:
   ```bash
   git clone https://github.com/SimonPatry/api_dofus_db
2. Launch App:
   ```bash
   npm start
