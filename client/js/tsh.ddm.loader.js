define(["ddm"], function (Tsh) {
    Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}

    Tsh.Ddm.Loader = {

        loaded: true,
        loadedCount: 0, // Assets that have been loaded so far
        totalCount: 0, // Total number of asstes that need loading
        soundFileExtn: ".ogg",

        store:{
            module:{}
        },

        init: function (app) {
            var mp3support, oggsupport;
            var audio = document.createElement("ddm-audio")

            if (audio.canPlayType) {
                mp3support = "" !== audio.canPlayType("audio/mpeg");
                oggsupport = "" !== audio.canPlayType("audio/ogg; codecs=\"vorbis\"");
            } else {
                mp3support = false
                oggsupport = false
            }
            // Check for ogg, then mp3, and finally set soundFileExtn to undefined
            Tsh.Ddm.Loader.soundFileExtn = oggsupport ? ".ogg" : mp3support ? ".mp3" : undefined;
        
            this.app = app
            if(this._onInitialized){
                this._onInitialized()
            }
        },
        loadImage: function (url) {
            this.loaded = false;
            this.totalCount++;
            var image = new Image();
            image.addEventListener("load", Tsh.Ddm.Loader.itemLoaded, false);
            image.src = url;
            return image;
        },
        loadSound: function (url) {
            this.loaded = false;
            this.totalCount++;
            var audio = new Audio();
            audio.addEventListener("canplaythrough", Tsh.Ddm.Loader.itemLoaded, false);
            audio.src = url + Tsh.Ddm.Loader.soundFileExtn;
            return audio;
        },
        loadModule: function(url,callback){
            if(url in this.store.module){
                if(callback){
                    setTimeout(callback,4)
                }
                return this.store.module[url]
            }
            this.loaded = false;
            this.totalCount++;
            var result = {
                data:{},
                status: "loading",
            }
            this.store.module[url] = result

            require([url],function(module){ // On success
                deepCopyTo(result.data,module)
                result.status = "complete"
                Tsh.Ddm.Loader.totalCount++;
                if (Tsh.Ddm.Loader.loadedCount === Tsh.Ddm.Loader.totalCount) {
                    // Loader has loaded completely..
                    // Reset and clear the loader
                    Tsh.Ddm.Loader.loaded = true;
                    Tsh.Ddm.Loader.loadedCount = 0;
                    Tsh.Ddm.Loader.totalCount = 0;
                    // Hide the loading screen
                    // and call the loader.onload method if it exists
                    if (Tsh.Ddm.Loader.onload) {
                        Tsh.Ddm.Loader.onload();
                        Tsh.Ddm.Loader.onload = undefined;
                    }
                }    
                if(callback){
                    callback()
                }
            },
            function(module){ //On Non success;
                result.status = "error"
                if(callback){
                    callback()
                }
            }
            );
            return result;
        },
        
        itemLoaded: function (ev) {
            // Stop listening for event type (load or canplaythrough) for this item now that it has been loaded
            ev.target.removeEventListener(ev.type, Tsh.Ddm.Loader.itemLoaded, false);
            Tsh.Ddm.Loader.loadedCount++;
            if (Tsh.Ddm.Loader.loadedCount === Tsh.Ddm.Loader.totalCount) {
                // Loader has loaded completely..
                // Reset and clear the loader
                Tsh.Ddm.Loader.loaded = true;
                Tsh.Ddm.Loader.loadedCount = 0;
                Tsh.Ddm.Loader.totalCount = 0;
                // Hide the loading screen
                // and call the loader.onload method if it exists
                if (Tsh.Ddm.Loader.onload) {
                    Tsh.Ddm.Loader.onload();
                    Tsh.Ddm.Loader.onload = undefined;
                }
            }
        },
        load: function (url) {
            this.totalCount++;
            this.load = false;
            var image = new Image();
            image.src = url;
            image.onload = function () {
                imageLoader.loadedImages++;
                if (imageLoader.loadedImages === imageLoader.totalImages) {
                    imageLoader.loaded = true
                }
                image.onload = undefined
            }
            return image;
        },

        onInitialized   (callback){this._onInitialized = callback},

    }
    
})