

## data structures

`struct realms: {0, 1, 2, 3}  // 0 - archived/collection, 1 - Assess,  2 - Decide, 3 - Do`

`struct task: {taskId, realmId, name, context, date, pojectId}`

`struct project: {projectId, realmId, name}`

`struct context: {contextId, name}`

`struct collection: {collectionId, name}`

## functions

addProject(name)
    addTaskToProject(taskId, projectId)
    detachTaskFromProject(taskId, projectId)
    moveTaskToProject(taskId, projectId)

addContext(name)

addTask(name)

moveProjectToRealm(projectId, realmId)

moveTaskToRealm(taksId, realmId)

addProjectToCollection(projectId, collectionId) // set realmId to 0

addTaskToCollection(taskId, collectionId) // set realmId to 0

editProject(projectId)

editTask(taskId)

editContext(contextId)

editCollection(collectionId)

---

tasksByRealm(realmId)

projectsByRealm(realmId)

tasksByContext(contextId)

projectsByContext(contextId)

tasksByTime(timeSlice) - today, beforeToday, tomorrow, sooon

projectsByTime(timeSlice) - today, beforeToday, tomorrow, soon

