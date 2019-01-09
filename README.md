# JavaLearningTool-front-facing
This will route traffic for the JavaLearningTool

# Database
**The exact files and names of collections for the below may vary for your computer. Check the names of your docker images and also the volumes for your docker images (Can be found in the docker-compose.yml or the Dockerfile)**
## Create backup of server db

```
// On Server
docker exec javalearningtoolserverutil_mongo_1 mongodump --db JavaLearningTool --out /tmp/backup
// On local machine
scp -r <username>@nova.cc.gatech.edu:~/backup/ <path-to-local-backup>
```

## Restore server db
**This may destroy any data currently in the db so make a backup**
```
// On local machine
scp -r <path-to-local-backup> .<username>@nova.cc.gatech.edu:~/backup/
// On server
docker exec javalearningtoolserverutil_mongo_1 mongorestore --db JavaLearningTool /tmp/backup/JavaLearningTool
```

## Extract local db
```
docker exec javalearningtool_mongo_1 mongodump --db JavaLearningTool --out /tmp/backup
```

## Restore local db from backup
**This may destroy any data currently in the db so make a backup**
```
docker exec javalearningtool_mongo_1 mongorestore --db JavaLearningTool /tmp/backup/JavaLearningTool
```

# Testing
## Load Test
Need to install artillery.
```
artillery run tests/load/complete_test.yml
```