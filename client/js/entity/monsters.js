define(["entity/monster"],function(Monster){
    var Monsters = {};
    Monsters.requestMonsterMetadata = function(kind){
        if(kind in Monster){
            console.log("Already Registered")
            return
        }
        var a = Tsh.Ddm.Loader.loadModule("server-meta-data/monster/"+kind,function(){
            if(a){
                if(a.status == "complete"){
                    console.log("get data = ",a.data)
                    Monsters[kind] = {}
                    Monsters[kind].classdata  = Monster.extend(a.data)
                    Monsters[kind].metadata   = a.data
                    console.log("SUCCESSED LOADING ",kind," = ",Monsters[kind]," name = ",a.data.name)
                }else{
                    Monsters[kind] = {}
                    Monsters[kind].classdata = null
                    Monsters[kind].metadata = {}
                    console.log("[ERROR] current status = ",a.status)
                }
            }else{
                console.log("[ERROR] Cannot loaded success: data is empty")
            }
        })
    }
    Monsters.requestMonsterMetadata("dummymonster1")
    Monsters.requestMonsterMetadata("dummymonster2")
    Monsters.requestMonsterMetadata("dummymonster3")
    return Monsters
})