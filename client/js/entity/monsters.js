define(["entity/monster"], function (Monster) {
    var Monsters = {};
    Monsters.requestMonsterMetadata = async function (kind) {
        if (kind in Monster) {
            console.log("Already Registered")
            return
        }
        console.log("started requesting get monster metadata ", kind)
        var a = await Tsh.Ddm.Loader.loadModuleAsync("server-meta-data/monster/" + kind)
        if (a) {
            if (a.status == "complete") {
                console.log("get data = ", a.data)
                Monsters[kind] = {}
                Monsters[kind].classdata = Monster.extend(a.data)
                Monsters[kind].metadata = a.data
                console.log("SUCCESSED LOADING ", kind, " = ", Monsters[kind], " name = ", a.data.name)
            } else {
                Monsters[kind] = {}
                Monsters[kind].classdata = null
                Monsters[kind].metadata = {}
                console.log("[ERROR] current status = ", a.status)
            }
        } else {
            console.log("[ERROR] Cannot loaded success: data is empty")
        }
    }
    return Monsters
})