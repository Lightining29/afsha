$cfgPath = 'C:\Program Files\MongoDB\Server\8.3\bin\mongod.cfg'
(Get-Content $cfgPath) -replace "replication:`r`n  replSetName: rs0", '#replication:' -replace "replication:`n  replSetName: rs0", '#replication:' | Set-Content $cfgPath
Restart-Service MongoDB
