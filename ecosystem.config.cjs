module.exports = {
    apps : [{
        name : "dm-formacion",
        instances : 1,
        exec_mode : "cluster",
        script : "./dist/server/entry.mjs",
        autorestart : true,
        watch: false,
        max_memory_restart: "2G",
        env: {
            HOST: "10.200.110.4",
            PORT: "8057"
        }
    }]
}